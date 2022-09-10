import { WebhookClient } from "discord.js";

import { ExtendedClient } from "../interfaces/ExtendedClient";

/**
 * Validates that all environment variables are set, then
 * returns the config object for the bot.
 *
 * @returns {ExtendedClient["env"]} The config object for the bot.
 */
export const validateEnv = (): ExtendedClient["env"] => {
  if (!process.env.TOKEN) {
    throw new Error("Missing TOKEN");
  }

  if (!process.env.HOME_GUILD) {
    throw new Error("Missing HOME_GUILD");
  }

  if (!process.env.EVENT_CHANNEL) {
    throw new Error("Missing EVENT_CHANNEL");
  }

  if (!process.env.DEBUG_HOOK) {
    throw new Error("Missing DEBUG_HOOK");
  }

  return {
    token: process.env.TOKEN,
    homeGuild: process.env.HOME_GUILD,
    eventChannel: process.env.EVENT_CHANNEL,
    debugHook: new WebhookClient({ url: process.env.DEBUG_HOOK }),
  };
};
