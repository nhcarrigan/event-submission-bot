import { ExtendedClient } from "../interfaces/ExtendedClient";

import { onReady } from "./onReady";

/**
 * Mounts the gateway event listeners.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 */
export const handleEvents = (bot: ExtendedClient) => {
  bot.on("ready", async () => await onReady(bot));
};
