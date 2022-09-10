import { Interaction } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";

/**
 * Module to handle the interaction create event from Discord.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {Interaction} interaction The interaction payload from Discord.
 */
export const onInteraction = async (
  bot: ExtendedClient,
  interaction: Interaction
) => {
  try {
    if (interaction.isChatInputCommand()) {
      const target = bot.commands.find(
        (c) => c.data.name === interaction.commandName
      );

      if (!target) {
        await interaction.reply({
          ephemeral: true,
          content: `${interaction.commandName} is not a valid command - please contact Naomi.`,
        });
        return;
      }

      await target.run(bot, interaction);
    }
  } catch (err) {
    await errorHandler(bot, "on interaction", err);
  }
};
