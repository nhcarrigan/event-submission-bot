import { EmbedBuilder } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";

import { logHandler } from "./logHandler";

/**
 * Utility to pipe error messages to the console
 * and the Discord error webhook.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {string} context A brief description of where the error occurred.
 * @param {unknown} error The node.js error object.
 */
export const errorHandler = async (
  bot: ExtendedClient,
  context: string,
  error: unknown
) => {
  // Type coercion because TS assumes errors in try/catch are unknown.
  const err = error as Error;
  logHandler.log("error", `Error in ${context}:`);
  logHandler.log("error", JSON.stringify(err.stack, null, 2));

  const embed = new EmbedBuilder();
  embed.setTitle(`Error in ${context}`);
  embed.setDescription(`\`\`\`\n${JSON.stringify(err.stack, null, 2)}\n\`\`\``);

  await bot.env.debugHook.send({ embeds: [embed] });
};
