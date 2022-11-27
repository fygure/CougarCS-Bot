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
export const echo: Command = {
  
  data: new SlashCommandBuilder()
    .setName("echo")
    .setDescription("Sends user their personal info.")
    .addStringOption((option) =>
      option
        .setName("uhid")
        .setDescription("The email you entered when signing up for member")
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
      "ECHO", //Title
      "echo swag, " + user.username + "!", //Description
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

    const user_id_raw = interaction.options.get('uhid',true);
    //console.log(user_id_raw.value);


    //API call to GET all members in database
    fetch(`${process.env.ASTRO_API}/test/members`, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    },
    })
    .then(response => response.json())
    .then(response => 
        {
        //JSON.stringify(response)
        //console.log(response.length);

        //API call to GET user's cougar coin balance using UH ID input from command
        fetch(`${process.env.ASTRO_API}/test/members/points?uh_id=${user_id_raw.value}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            })
            .then(response2 => response2.json())
            .then(response2 => {
                //TODO: 
                //(done) Loop through 'response' json to find block with 
                //  corresponding UH ID collected from user input.

                //(done) Save index of json block and send message with it.

                //OPTIONAL: Sort the JSON by UH ID for optimal time complexity.

                let i = 0;
                for(i; i<response.length; i++ )
                {
                    if(response[i].uh_id == user_id_raw.value)
                    {
                        break;
                    }
                }

                //DEBUGGING and TESTING
                console.log(i);



                //2159466 test uh id (index 0)
                //1919068 test uh id (index 1)
                //2018644 (ben's uh id)
                console.log(response2.member_points);

                const message = createEmbeded(
                    `${user.username} || Cougar Coins`, //Title
                    `Cougar coin balance: ${response2.member_points}`, //Description
                    user,
                    client
                  )
                  .addFields({ name: 'Contact ID: ', value: `${response[i].contact_id}` })
    
                user.send({embeds: [message]});




            })
            //console.log('end second api call')
            



        })
    //remove if not using
    // .then(response =>
    //     {
    //         console.log("end all");
    //     })

    

    //start api call and message
    // https.get(
    //   `${process.env.ASTRO_API}/test/members`,
    //   (res) => {
    //     let data = "";
    //     res.on("data", (chunk) => {
    //       data += chunk;
    //     });
    //     res.on("end", () => {
    //       const json = JSON.parse(data);
    //       // Here is where you can edit your reply with the data from "json"

    //       //find index of matching discord user and data
    //       //note down index for use below

    //       //FIND USER MATCHING INDEX OF JSON AND RETURN IT
    //       //REPLACE ALL 0s WITH INDEX

    //       /////////////////////////////////////////////////////////////
    //       // Handle shirt sizes
    //       let shirt_size = ''
    //       if (json.shirt_size_id == 'sm') { shirt_size = 'Small'}
    //       else if (json[0].shirt_size_id == 'med') { shirt_size = 'Medium'}
    //       else if (json[0].shirt_size_id == 'lg') { shirt_size = 'Large'}
    //       else if (json[0].shirt_size_id == 'xl') { shirt_size = 'Extra Large'}
    //       else if (json[0].shirt_size_id == 'xs') { shirt_size = 'Extra Small'}
    //       else { shirt_size = 'N/A' } // sometimes is null
    //       /////////////////////////////////////////////////////////////
    //       // Needed resources for profile and extra
    //       const user_avatar = user.displayAvatarURL()
    //       // Display profile embed
    //       //const image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Sign-check-icon.png/640px-Sign-check-icon.png"
    //       const message = createEmbeded(
    //         "CougarCS profile\u200B", //Title
    //         `Cougar Coins: ${404}`,
    //         // "\n***Contact ID:*** " + json[0].contact_id +  //Description
    //         // "\n***UH ID:*** " + json[0].uh_id +
    //         // "\n***Email:*** " + json[0].email +
    //         // "\n***Discord ID:*** " + user.username + "#" + user.discriminator +
    //         // "\n***First Name:*** " + json[0].first_name +
    //         // "\n***Last Name:*** " + json[0].last_name +
    //         // "\n***Phone Number:*** " + json[0].phone_number +
    //         // "\n***Shirt Size:*** " + shirt_size,
    //         //"\n***Timestamp:*** " + json[0].timestamp, 
    //         user,
    //         client
    //       )
    //       .setColor("Red")
    //       //.setFooter({text: `${client.user?.tag}`}) //CougarCS Bot signing
    //       .setTimestamp(null)
    //       .setThumbnail(user_avatar)
    //       .setAuthor({ name: 'Home', iconURL: cougarCS_icon, url: 'https://cougarcs.com/' })
    //       .addFields({ name: '\u200b', value: '\u200b' })
    //       .addFields(
    //         {
    //           name: 'First' ,
    //           value: json[0].first_name,
    //           inline: true,
    //         },
    //         {
    //           name: 'Last' ,
    //           value: json[0].last_name,
    //           inline: true,
    //         },
    //         {
    //           name: 'UH PSID' ,
    //           value: json[0].uh_id,
    //           inline: true,
    //         },
    //         {
    //           name: 'Email' ,
    //           value: json[0].email,
    //           inline: false,
    //         },
    //         {
    //           name: 'Discord ID' ,
    //           value: user.username + '#' + user.discriminator,
    //           inline: true,
    //         },
            
    //         {
    //           name: 'Phone Number' ,
    //           value: json[0].phone_number,
    //           inline: true,
    //         },
    //         {
    //           name: 'Shirt Size' ,
    //           value: shirt_size,
    //           inline: true,
    //         },
    //         {
    //           name: 'Contact ID' ,
    //           value: json[0].contact_id,
    //           inline: false,
    //         },
    //         // {
    //         //   name: '\u200B' ,
    //         //   value:  '\u200B',
    //         //   inline: false,
    //         // }
    //       )

          
    //       user.send({embeds: [message]})

    //       //debug
    //       console.log(user)
    //       //console.log(json[0].contact_id);

    //       // If you wanna see exactly what the output is for testing, you can do this
    //       //interaction.editReply(JSON.stringify(json));
          
          
    //     });
    //   }
    // );
    //end api call and message
    
    //FIXME need to keep loading message up until cougarcs bot dms
    
    // if successful, send this

    //interaction.editReply({ embeds: [load_message] });
    interaction.editReply({ embeds: [returnMessage] });
    
    return;
  },


  
};
