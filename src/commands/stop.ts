import { CommandInteraction } from "discord.js/typings/index.js";
import { checkMC, getWrongMcResponse } from "./mc";
import { AudioStreamer } from "../audio-streamer/audio-streamer";
import { CommonEmbeds } from "../common/common-embeds";

export async function stop(interaction: CommandInteraction) {
    if (await checkMC(interaction.channelId) === false) {
        await getWrongMcResponse(interaction);
        return;
    }
    AudioStreamer.get().stop();
    await interaction.reply('\`🤧 Music stopped\`');
};