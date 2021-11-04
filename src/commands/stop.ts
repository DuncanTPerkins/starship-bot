import { CommandInteraction, MessageEmbed } from "discord.js";
import { AudioStreamer } from "../audio-streamer/audio-streamer";
import { CommonEmbeds } from "../common/common-embeds";
import { SongQueue } from "../song-queue/song-queue";
import { checkMC, getWrongMcResponse } from "./mc";

export async function stop(interaction: CommandInteraction) {
    if (await checkMC(interaction.channelId) === false) {
        await getWrongMcResponse(interaction);
        return;
    }
    const queue = SongQueue.get();
    if (queue.isEmpty()) {
        interaction.reply({ embeds: [CommonEmbeds.empty()] })
        return;
    }
    const stoppedTrack = queue.currentTrack?.title;
    AudioStreamer.get().stop();
    queue.clearQueue();
    interaction.reply({
        embeds: [
            new MessageEmbed()
                .setTitle('Music Stopped')
                .setColor('#c23b22')
                .setDescription(`Current track: **${stoppedTrack}** was deemed cringe`)
        ]
    });
};