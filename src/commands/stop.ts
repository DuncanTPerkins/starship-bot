import { CommandInteraction } from "discord.js/typings/index.js";
import { checkMC, getWrongMcResponse } from "./mc";
import { stopAudioPlayer } from "./player";
import { AudioStreamer } from "../audio-streamer/audio-streamer";

export async function stop(interaction: CommandInteraction) {
    if (await checkMC(interaction.channelId) === false) {
        await getWrongMcResponse(interaction);
        return;
    }
};