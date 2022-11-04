import { SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces/Command";
import { createEmbeded } from "../utils/embeded";

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

        user.send('yo')




    // if successful, send this
    await interaction.editReply({ embeds: [returnMessage] });
    return;
  },
};
