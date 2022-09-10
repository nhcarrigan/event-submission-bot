import {
  ChannelType,
  GuildMember,
  GuildScheduledEventCreateOptions,
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
  Interaction,
  PermissionFlagsBits,
  User,
} from "discord.js";
import { DateTime } from "luxon";

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

    if (interaction.isButton()) {
      const { member, guild } = interaction;

      if (
        !guild ||
        !member ||
        !(member as GuildMember).permissions.has(
          PermissionFlagsBits.ManageEvents
        )
      ) {
        await interaction.reply({
          content:
            "You do not have permission to approve or deny event submissions.",
          ephemeral: true,
        });
        return;
      }

      await interaction.deferUpdate();
      const user = member.user as User;

      if (interaction.customId === "deny") {
        const eventEmbed = interaction.message.embeds[0];

        await interaction.message.edit({
          embeds: [
            {
              ...eventEmbed,
              color: 0xff0000,
              fields: [
                ...eventEmbed.fields,
                { name: "Denied by", value: user.tag },
              ],
            },
          ],
          components: [],
        });
      }

      if (interaction.customId === "approve") {
        const eventEmbed = interaction.message.embeds[0];

        await interaction.message.edit({
          embeds: [
            {
              ...eventEmbed,
              color: 0x00ff00,
              fields: [
                ...eventEmbed.fields,
                { name: "Approved by", value: user.tag },
              ],
            },
          ],
          components: [],
        });

        const eventType = eventEmbed.fields[0].value;
        const location = eventEmbed.fields[1].value;
        const startTimeString = eventEmbed.fields[2].value.replace(/\D/g, "");
        const endTimeString = eventEmbed.fields[3].value.replace(/\D/g, "");

        const startTime = DateTime.fromMillis(
          parseInt(startTimeString) * 1000
        ).setZone("UTC");
        const endTime = DateTime.fromMillis(
          parseInt(endTimeString) * 1000
        ).setZone("UTC");

        const eventData: GuildScheduledEventCreateOptions =
          eventType === "external"
            ? {
                name: eventEmbed.title as string,
                description: eventEmbed.description as string,
                scheduledStartTime: startTime.toISO(),
                scheduledEndTime: endTime.toISO(),
                entityType: GuildScheduledEventEntityType.External,
                privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
                entityMetadata: {
                  location,
                },
              }
            : {
                name: eventEmbed.title as string,
                description: eventEmbed.description as string,
                scheduledStartTime: startTime.toISO(),
                scheduledEndTime: endTime.toISO(),
                entityType:
                  (await guild.channels.fetch(location.replace(/\D/g, "")))
                    ?.type === ChannelType.GuildStageVoice
                    ? GuildScheduledEventEntityType.StageInstance
                    : GuildScheduledEventEntityType.Voice,
                privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
                channel: location.replace(/\D/g, ""),
              };

        await guild.scheduledEvents.create(eventData);
      }
    }
  } catch (err) {
    await errorHandler(bot, "on interaction", err);
  }
};
