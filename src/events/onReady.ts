import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";

/**
 * Handles the ready event from Discord.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const onReady = async (bot: ExtendedClient) => {
  try {
    await bot.env.debugHook.send(`Logged in as ${bot.user?.tag}`);
  } catch (err) {
    await errorHandler(bot, "on ready event", err);
  }
};
