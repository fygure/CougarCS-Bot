import { SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces/Command";
import { createEmbeded } from "../utils/embeded";
import https from "https";
import "dotenv"
import { create } from "domain";

export const profile: Command = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Sends user their personal info."),
  run: async (interaction, client) => {
    // ephemeral: true <- only user that called command can see it.
    await interaction.deferReply({ ephemeral: false });
    const { user } = interaction;
    const returnMessage = createEmbeded(
      "Success", //Title
      "Check your DM, " + user.username + "!", //Description
      user,
      client
    )
    .setColor("Green")
    .setFooter(null)
    .setTimestamp(null);
    //end returnMessage
    const load_message = createEmbeded(
      "Retrieving data",
      "..Please wait..",
      user,
      client
    )
    //start api call and message
    https.get(
      `${process.env.ASTRO_API}/test/members`, // "/endpoint" will be your actual endpoint
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          const json = JSON.parse(data);
          // Here is where you can edit your reply with the data from "json"
          /*
            TODO:
            - find connection between member profiles and discord id (use email for now)
            - use that to call data from each member
            - format into presentable profile stats
            - need member coin too
            - get icon pack for cougarCS images
            - format embed below to the djs documentation
          */
          
         
          // Display profile embed
          const image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Sign-check-icon.png/640px-Sign-check-icon.png"
          const message = createEmbeded(
            "CougarCS profile: " + user.username, //Title
            "\n***Contact ID:*** " + json[0].contact_id +  //Description
            "\n***UH ID:*** " + json[0].uh_id +
            "\n***Email:*** " + json[0].email +
            "\n***First Name:*** " + json[0].first_name +
            "\n***Last Name:*** " + json[0].last_name +
            "\n***Phone Number:*** " + json[0].phone_number +
            "\n***Shirt Size:*** " + json[0].shirt_size_id,
            //"\n***Timestamp:*** " + json[0].timestamp, 
            user,
            client
          )
          .setColor("Red")
          .setFooter({text: `${client.user?.tag}`}) //CougarCS Bot signing
          .setTimestamp(null)
          .setImage(image_url);
          user.send({embeds: [message]})
          console.log(user)
          //console.log(json[0].contact_id);

          // If you wanna see exactly what the output is for testing, you can do this
          //interaction.editReply(JSON.stringify(json));
        });
      }
    );
    //end api call and message
    

    interaction.editReply({ embeds: [load_message]} );
    // if successful, send this
    await interaction.editReply({ embeds: [returnMessage] });
    return;
  },
};


//TODO:
/*
  - connect to astro API
  - send a get request to the api to get user's data
  - format data into a message
  - send to user
*/
