import { SlashCommandBuilder } from "discord.js";
import { Command } from "../interfaces/Command";
import { createEmbeded } from "../utils/embeded";

export const ping: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Basic Discord bot command example")
    .addStringOption((option) =>
      option
        .setName("email")
        .setDescription("The email you entered when signing up for member")
        .setRequired(true)
    ),
  run: async (interaction, client) => {
    // ephemeral: true <- only user that called command can see it.
    await interaction.deferReply({ ephemeral: false });
    const { user } = interaction;
    const returnMessage = createEmbeded(
      "Pong!", //Title
      "Thanks for using /ping, " + user.username + "!", //Description
      user,
      client
    )
      .setColor("Green")
      .setFooter(null)
      .setTimestamp(null);

    const email = interaction.options.get('email', true);
    console.log(email);

    await interaction.editReply({ embeds: [returnMessage] });
    return;
  },
};
