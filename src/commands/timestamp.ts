import { SlashCommandBuilder } from "discord.js";
import { DateTime } from "luxon";

import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";

export const timestamp: Command = {
  data: new SlashCommandBuilder()
    .setName("timestamp")
    .setDescription(
      "Get a timestamp from a date. Useful for the submit command. USE UTC TIMES ONLY."
    )
    .addNumberOption((option) =>
      option
        .setName("day")
        .setDescription("The day of your event (1-31)")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(31)
    )
    .addNumberOption((option) =>
      option
        .setName("month")
        .setDescription("The month of your event.")
        .setRequired(true)
        .addChoices(
          { name: "January", value: 1 },
          { name: "February", value: 2 },
          { name: "March", value: 3 },
          { name: "April", value: 4 },
          { name: "May", value: 5 },
          { name: "June", value: 6 },
          { name: "July", value: 7 },
          { name: "August", value: 8 },
          { name: "September", value: 9 },
          { name: "October", value: 10 },
          { name: "November", value: 11 },
          { name: "December", value: 12 }
        )
    )
    .addNumberOption((option) =>
      option
        .setName("year")
        .setDescription("The year of your event.")
        .setRequired(true)
        .setMinValue(new Date().getFullYear())
    )
    .addNumberOption((option) =>
      option
        .setName("hour")
        .setDescription("The hour your event takes place (use 24 hour time).")
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(23)
    )
    .addNumberOption((option) =>
      option
        .setName("minutes")
        .setDescription("The minutes your event takes place.")
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(59)
    ),
  run: async (bot, interaction) => {
    try {
      await interaction.deferReply({ ephemeral: true });

      const day = interaction.options.getNumber("day", true);
      const month = interaction.options.getNumber("month", true);
      const year = interaction.options.getNumber("year", true);
      const hour = interaction.options.getNumber("hour", true);
      const minute = interaction.options.getNumber("minutes", true);

      const timestamp = DateTime.fromObject({
        day,
        month,
        year,
        hour,
        minute,
      })
        .setZone("UTC")
        .toMillis();

      await interaction.editReply({
        content: `Your milliseconds timestamp is: \`${timestamp}\`\n\nThis corresponds to <t:${Math.round(
          timestamp / 1000
        )}:F>\n\nIf this time is incorrect, please try again and be sure you use UTC time, not local time, for the hour value.`,
      });
    } catch (err) {
      await errorHandler(bot, "timestamp command", err);
      await interaction.editReply("Something broke! Please contact Naomi~!");
    }
  },
};
