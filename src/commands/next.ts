import { CommandInteraction, MessageEmbed } from "discord.js";
import { AudioStreamer } from "../audio-streamer/audio-streamer";
import { CommonEmbeds } from "../common/common-embeds";
import { SongQueue } from "../song-queue/song-queue";

export async function next(interaction: CommandInteraction) {
    const queue = SongQueue.get();
    const streamer = AudioStreamer.get();
    const current = queue.currentTrack;
    SongQueue.get().trackChanged.pipe().subscribe((queueItem) => {
        if (!queueItem || queueItem === current) {
            return;
        }
        streamer.getAudioPlayer(queueItem?.url);
    });

    const next = queue.onTrackEnded();

    if (next) {
        interaction.reply({
            embeds: [
                CommonEmbeds.musicEmbed('Now Playing:', next?.title || '', next?.url || '', next?.thumbnail || '')
            ]
        })
    } else {
        streamer.stop();
        interaction.reply({
            embeds: [new MessageEmbed()
                .setTitle('End of Queue')
                .setDescription(`No songs remaining`)
                .setColor(0x00AE86)
            ]
        });
    }
}