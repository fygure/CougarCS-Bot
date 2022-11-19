import { SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces/Command";
import { createEmbeded } from "../utils/embeded";
import https from "https";
import "dotenv"

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
            - find connection between member profiles and discord id
            - use that to call data from each member
            - format into presentable profile stats
            - need member coin too
          */
         
          // Display profile embed
          const message = createEmbeded(
            "CougarCS profile: " + user.username, //Title
            "\nContact ID: " + json[0].contact_id +  //Description
            "\nUH ID: " + json[0].uh_id +
            "\nEmail: " + json[0].email +
            "\nFirst Name: " + json[0].first_name +
            "\nLast Name: " + json[0].last_name +
            "\nPhone Number: " + json[0].phone_number +
            "\nShirt Size: " + json[0].shirt_size_id +
            "\nTimestamp: " + json[0].timestamp, 
            user,
            client
          )
          .setColor("Blue")
          .setFooter(null)
          .setTimestamp(null);
            
          user.send({embeds: [message]})
          console.log(user)
          //console.log(json[0].contact_id);

          // If you wanna see exactly what the output is for testing, you can do this
          //interaction.editReply(JSON.stringify(json));
        });
      }
    );
    //end api call and message
    


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
