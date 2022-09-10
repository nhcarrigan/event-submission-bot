import { Client } from "discord.js";

import { IntentOptions } from "./config/IntentOptions";
import { handleEvents } from "./events/_handleEvents";
import { ExtendedClient } from "./interfaces/ExtendedClient";
import { validateEnv } from "./utils/validateEnv";

(async () => {
  const bot = new Client({ intents: IntentOptions }) as ExtendedClient;
  bot.env = validateEnv();

  await handleEvents(bot);

  await bot.login(bot.env.token);
})();
