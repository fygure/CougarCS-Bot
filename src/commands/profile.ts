import { SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces/Command";
import { createEmbeded } from "../utils/embeded";
import https from "https";
import "dotenv"
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
//Discord "/profile" command
export const profile: Command = {
  
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Sends user their personal info.")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("Your UH PSID associated with CougarCS.")
        .setRequired(true)
    ),
  run: async (interaction, client) => {
    // ephemeral: true <- only user that called command can see it.
    await interaction.deferReply({ ephemeral: false });
    //const user_input = interaction.options.getString("email", true);
    //console.log(user_input);
    /////////////////////////////////////////////////////////////
    const { user } = interaction;
    const cougarCS_icon = "https://i.imgur.com/GwZuBl0.png"
    const returnMessage = createEmbeded(
      "Success", //Title
      "Check your DM, " + user.username + "!", //Description
      user,
      client
    )
    .setColor("Green");
    // .setFooter(null)
    // .setTimestamp(null);
    //end returnMessage
    const invalid_message = createEmbeded(
      "Invalid UH PSID",
      "..Please Try Again..",
      user,
      client
    )
    .setColor("Yellow")
    //Check user input ID if in database and if member
    const user_id_raw = interaction.options.get('id', true);
    console.log(user_id_raw.value);

    const user_id = user_id_raw.value;

    // if (user_id.length != 7)
    // {
    //   interaction.editReply({ embeds: [invalid_message] });
    //   return;
    // }

    //call api request with /members?uh_id=
    
    //start api call and message
    https.get(
      `${process.env.ASTRO_API}/test/members`,
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          const json = JSON.parse(data);
          // Here is where you can edit your reply with the data from "json"
          //find index of matching discord user and data
          //note down index for use below

          //FIND USER MATCHING INDEX OF JSON AND RETURN IT
          //REPLACE ALL 0s WITH INDEX

          /////////////////////////////////////////////////////////////
          // Handle shirt sizes
          let shirt_size = ''
          if (json.shirt_size_id == 'sm') { shirt_size = 'Small'}
          else if (json[0].shirt_size_id == 'med') { shirt_size = 'Medium'}
          else if (json[0].shirt_size_id == 'lg') { shirt_size = 'Large'}
          else if (json[0].shirt_size_id == 'xl') { shirt_size = 'Extra Large'}
          else if (json[0].shirt_size_id == 'xs') { shirt_size = 'Extra Small'}
          else { shirt_size = 'N/A' } // sometimes is null
          /////////////////////////////////////////////////////////////
          // Needed resources for profile and extra
          const user_avatar = user.displayAvatarURL()
          // Display profile embed
          //const image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Sign-check-icon.png/640px-Sign-check-icon.png"
          const message = createEmbeded(
            "CougarCS profile\u200B", //Title
            `Cougar Coins: ${404}`,
            // "\n***Contact ID:*** " + json[0].contact_id +  //Description
            // "\n***UH ID:*** " + json[0].uh_id +
            // "\n***Email:*** " + json[0].email +
            // "\n***Discord ID:*** " + user.username + "#" + user.discriminator +
            // "\n***First Name:*** " + json[0].first_name +
            // "\n***Last Name:*** " + json[0].last_name +
            // "\n***Phone Number:*** " + json[0].phone_number +
            // "\n***Shirt Size:*** " + shirt_size,
            //"\n***Timestamp:*** " + json[0].timestamp, 
            user,
            client
          )
          .setColor("Red")
          //.setFooter({text: `${client.user?.tag}`}) //CougarCS Bot signing
          .setTimestamp(null)
          .setThumbnail(user_avatar)
          .setAuthor({ name: 'Home', iconURL: cougarCS_icon, url: 'https://cougarcs.com/' })
          .addFields({ name: '\u200b', value: '\u200b' })
          .addFields(
            {
              name: 'First' ,
              value: json[0].first_name,
              inline: true,
            },
            {
              name: 'Last' ,
              value: json[0].last_name,
              inline: true,
            },
            {
              name: 'UH PSID' ,
              value: json[0].uh_id,
              inline: true,
            },
            {
              name: 'Email' ,
              value: json[0].email,
              inline: false,
            },
            {
              name: 'Discord ID' ,
              value: user.username + '#' + user.discriminator,
              inline: true,
            },
            
            {
              name: 'Phone Number' ,
              value: json[0].phone_number,
              inline: true,
            },
            {
              name: 'Shirt Size' ,
              value: shirt_size,
              inline: true,
            },
            {
              name: 'Contact ID' ,
              value: json[0].contact_id,
              inline: false,
            },
            // {
            //   name: '\u200B' ,
            //   value:  '\u200B',
            //   inline: false,
            // }
          )

          
          user.send({embeds: [message]})

          //debug
          //console.log(user)
          //console.log(json[0].contact_id);

          // If you wanna see exactly what the output is for testing, you can do this
          //interaction.editReply(JSON.stringify(json));
          
          
        });
      }
    );
    //end api call and message

    //FIXME need to keep loading message up until cougarcs bot dms
    
    // if successful, send this

    //interaction.editReply({ embeds: [load_message] });
    interaction.editReply({ embeds: [returnMessage] });
    
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
//DEPRECATED
// if (interaction.isChatInputCommand()) {
    //   //Construct Modal for user input
    //   const modal = new ModalBuilder()
    //   .setCustomId('myModal')
    //   .setTitle('Authentication')

    //   const user_input = new TextInputBuilder()
    //   .setCustomId('user_input')
    //   .setLabel("Enter your UH PSID")
    //   .setStyle(TextInputStyle.Short);

    //   const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(user_input);
    //   modal.addComponents(firstActionRow);
    //   interaction.showModal(modal);
    // }