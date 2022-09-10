import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";

import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";

export const submit: Command = {
  data: new SlashCommandBuilder()
    .setDMPermission(false)
    .setName("submit")
    .setDescription("Submit an event proposal for our community.")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("internal")
        .setDescription("Propose an event to be held within the server.")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name of your event.")
            .setRequired(true)
            .setMaxLength(256)
        )
        .addStringOption((option) =>
          option
            .setName("description")
            .setDescription("A brief description of your event.")
            .setRequired(true)
            .setMaxLength(4000)
        )
        .addChannelOption((option) =>
          option
            .setName("location")
            .setDescription(
              "The location of your event - this is probably a URL."
            )
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("start")
            .setDescription(
              "The start time for your event. Use the /timestamp command to get this."
            )
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("end")
            .setDescription(
              "The end time for your event. Use the /timestamp command to get this."
            )
            .setRequired(true)
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("external")
        .setDescription(
          "Propose an event to be held outside the server, such as a Twitter Space."
        )
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name of your event.")
            .setRequired(true)
            .setMaxLength(256)
        )
        .addStringOption((option) =>
          option
            .setName("description")
            .setDescription("A brief description of your event.")
            .setRequired(true)
            .setMaxLength(4000)
        )
        .addStringOption((option) =>
          option
            .setName("location")
            .setDescription(
              "The location of your event - this is probably a URL."
            )
            .setRequired(true)
            .setMaxLength(1024)
        )
        .addIntegerOption((option) =>
          option
            .setName("start")
            .setDescription(
              "The start time for your event. Use the /timestamp command to get this."
            )
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("end")
            .setDescription(
              "The end time for your event. Use the /timestamp command to get this."
            )
            .setRequired(true)
        )
    ),
  run: async (bot, interaction) => {
    try {
      await interaction.deferReply({ ephemeral: true });

      const { guild, user } = interaction;

      if (!guild) {
        await interaction.editReply({
          content:
            "Not sure how you ran this outside of a server, but please do not.",
        });
        return;
      }

      const channel =
        guild.channels.cache.get(bot.env.eventChannel) ||
        (await guild.channels.fetch(bot.env.eventChannel));

      if (!channel || !("send" in channel)) {
        await interaction.editReply({
          content:
            "The submission channel is misconfigured. Please contact Naomi.",
        });
        return;
      }

      const subcommand = interaction.options.getSubcommand();
      const name = interaction.options.getString("name", true);
      const description = interaction.options.getString("description", true);
      const start = interaction.options.getInteger("start", true);
      const end = interaction.options.getInteger("end", true);

      const embed = new EmbedBuilder();
      embed.setTitle(name);
      embed.setDescription(description);
      embed.addFields([
        { name: "Event Type", value: subcommand },
        {
          name: "Location",
          value:
            subcommand === "external"
              ? interaction.options.getString("location", true)
              : `<#${interaction.options.getChannel("location", true).id}>`,
        },
        { name: "Start Time", value: `<t:${Math.round(start / 1000)}:F>` },
        { name: "End Time", value: `<t:${Math.round(end / 1000)}:F>` },
      ]);
      embed.setAuthor({
        name: user.tag,
        iconURL: user.displayAvatarURL(),
      });

      const approveButton = new ButtonBuilder()
        .setCustomId("approve")
        .setEmoji("✅")
        .setLabel("Approve")
        .setStyle(ButtonStyle.Success);

      const denyButton = new ButtonBuilder()
        .setCustomId("deny")
        .setEmoji("🛑")
        .setLabel("Deny")
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents([
        approveButton,
        denyButton,
      ]);

      await channel.send({ embeds: [embed], components: [row] });
      await interaction.editReply({
        content: "Your event has been submitted~!",
      });
    } catch (err) {
      await errorHandler(bot, "submit command", err);
      await interaction.editReply("Something broke! Please contact Naomi~!");
    }
  },
};
