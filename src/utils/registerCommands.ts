import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";

import { ExtendedClient } from "../interfaces/ExtendedClient";

import { errorHandler } from "./errorHandler";

/**
 * Takes both the commands and contexts, parses the `data` properties as needed,
 * and builds an array of all command data. Then, posts the data to the Discord endpoint
 * for registering commands.
 *
 * Will register commands globally if in a production environment, otherwise defaults to the
 * home guild only.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @returns {boolean} True if the commands were registered, false on error.
 */
export const registerCommands = async (
  bot: ExtendedClient
): Promise<boolean> => {
  try {
    if (!bot.user) {
      throw new Error("Client user is not available.");
    }
    const rest = new REST({ version: "10" }).setToken(bot.env.token);

    const commandData = bot.commands.map((command) => command.data.toJSON());

    await rest.put(
      Routes.applicationGuildCommands(bot.user.id, bot.env.homeGuild),
      { body: commandData }
    );

    await bot.env.debugHook.send(
      "Successfully registered application commands."
    );
    return true;
  } catch (err) {
    await errorHandler(bot, "slash command register", err);
    return false;
  }
};
