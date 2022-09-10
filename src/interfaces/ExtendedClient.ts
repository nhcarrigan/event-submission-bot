import { Client, WebhookClient } from "discord.js";

import { Command } from "./Command";

export interface ExtendedClient extends Client {
  env: {
    token: string;
    homeGuild: string;
    eventChannel: string;
    debugHook: WebhookClient;
  };
  commands: Command[];
}
