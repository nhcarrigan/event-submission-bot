import { Client, WebhookClient } from "discord.js";

export interface ExtendedClient extends Client {
  env: {
    token: string;
    homeGuild: string;
    eventChannel: string;
    debugHook: WebhookClient;
  };
}
