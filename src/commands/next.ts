import { CommandInteraction, MessageEmbed } from "discord.js";
import { pipe, take } from "rxjs";
import { AudioStreamer } from "../audio-streamer/audio-streamer";
import { SongQueue } from "../song-queue/song-queue";

export async function next(interaction: CommandInteraction) {
    const queue = SongQueue.get();
    const streamer = AudioStreamer.get();
    const current = queue.currentTrack;
    SongQueue.get().trackChanged.pipe().subscribe((queueItem) => {
        console.log('event reached', queueItem);
        if (!queueItem || queueItem === current) {
            return;
        }
        streamer.getAudioPlayer(queueItem.url);
    });
    queue.onTrackEnded();

    const resultsMessage = new MessageEmbed()
    .setTitle(`📀 Now Playing: \`${ queue.currentTrack.title}\``)
    .setColor("#f73772")
    .addField(queue.currentTrack.title, queue.currentTrack.url);

await interaction.reply({ embeds: [resultsMessage] });
}