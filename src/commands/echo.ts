import { SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces/Command";
import { createEmbeded } from "../utils/embeded";
import https from "https";
import "dotenv"
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
//TODO: RENAME THIS FILE 
// THIS COMMAND IS COMPLETE FOR /echo
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
    //----------------------------------------------------------------------//
    //Variables to use for formatting and embeds
    const { user } = interaction;
    const cougarCS_icon = "https://i.imgur.com/GwZuBl0.png"
    const user_id_raw = interaction.options.get('uhid',true);
    //console.log(user_id_raw.value);
    // const returnMessage = createEmbeded(
    //   "ECHO", //Title
    //   "echoing, " + user.username + "!\n" + user_id_raw.value, //Description
    //   user,
    //   client
    // )
    // .setColor("Green")
    // .setFooter(null)
    // .setTimestamp(null);

    const returnMessage = createEmbeded(
        "Request Recieved", //Title
        "Check your DM, " + user.username + "!", //Description
        user,
        client
      )
      .setColor("Green");
      // .setFooter(null)
      // .setTimestamp(null);

    // const load_message = createEmbeded(
    //   "Retrieving data",
    //   "..Please wait..",
    //   user,
    //   client
    // )

    const invalid_message = createEmbeded(
        "Invalid UH PSID",
        "..Please Try Again..",
        user,
        client
      )
      .setColor("Yellow")
    //----------------------------------------------------------------------//
    /*
        response = JSON of all members in database
        response2 = JSON of specific member's cougarcoin points using .member_points suffix
        API call to GET all members in database
    */
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

                //OPTIONAL: 
                //(not started) Sort the JSON by UH ID for optimal time complexity.


                //This loop gets the index of the json for the user
                
                let i = 0;
                for(i; i<response.length; i++ )
                {
                    if(response[i].uh_id == user_id_raw.value)
                    {
                        break;
                    }
                }

                //Checks if iterator reaches end without break (or user not found in DB)
                if (i >= response.length)
                {
                    user.send({embeds: [invalid_message]});
                    return;
                }
                


                //-----------DEBUGGING and TESTING--------------//
                console.log(i);
                    //- test uh id (index 0)
                    //- test uh id (index 1)
                    //- (ben's uh id) (25 cougar coins)
                //console.log(response2.member_points);
                //----------------------------------------------//
                //Resources for message below
                //-------------Handle shirt sizes----------------//
                let shirt_size = ''
                if (response[i].shirt_size_id == 'sm') { shirt_size = 'Small'}
                else if (response[i].shirt_size_id == 'med') { shirt_size = 'Medium'}
                else if (response[i].shirt_size_id == 'lg') { shirt_size = 'Large'}
                else if (response[i].shirt_size_id == 'xl') { shirt_size = 'Extra Large'}
                else if (response[i].shirt_size_id == 'xs') { shirt_size = 'Extra Small'}
                else { shirt_size = 'N/A' } // sometimes is null
                //----------------------------------------------//
                const user_avatar = user.displayAvatarURL()
                // const test_message = createEmbeded(
                //     `${user.username} || Cougar Coins`, //Title
                //     `Cougar coin balance: ${response2.member_points}`, //Description
                //     user,
                //     client
                //   )
                //   .addFields({ name: 'Contact ID: ', value: `${response[i].contact_id}` })
                

                const message = createEmbeded(
                "CougarCS profile\u200B", //Title
                `Cougar coin balance: ${response2.member_points}`,
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
                    value: response[i].first_name,
                    inline: true,
                },
                {
                    name: 'Last' ,
                    value: response[i].last_name,
                    inline: true,
                },
                {
                    name: 'UH PSID' ,
                    value: response[i].uh_id,
                    inline: true,
                },
                {
                    name: 'Email' ,
                    value: response[i].email,
                    inline: false,
                },
                {
                    name: 'Discord ID' ,
                    value: user.username + '#' + user.discriminator,
                    inline: true,
                },
                
                {
                    name: 'Phone Number' ,
                    value: response[i].phone_number,
                    inline: true,
                },
                {
                    name: 'Shirt Size' ,
                    value: shirt_size,
                    inline: true,
                },
                {
                    name: 'Contact ID' ,
                    value: response[i].contact_id,
                    inline: false,
                },
                // {
                //   name: '\u200B' ,
                //   value:  '\u200B',
                //   inline: false,
                // }
                )
                



                // RETURN MESSAGE TO USER
                user.send({embeds: [message]});

            })
            //Further .then() chaining can happen here for 'response2'
            //end second api call for member points
            

        })
        //Further .then() chaining can happen here for 'response'

    

    await interaction.editReply({ embeds: [returnMessage] });
    
    return;
  },


  
};
