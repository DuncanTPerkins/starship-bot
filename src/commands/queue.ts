import { CommandInteraction, MessageEmbed } from 'discord.js';
import { CommonEmbeds } from "../common/common-embeds";
import { ItemState } from '../song-queue/models/queue-item';
import { SongQueue } from '../song-queue/song-queue';

export async function queue(interaction: CommandInteraction) {
    await interaction.deferReply();
    const track = SongQueue.get().currentTrack;
    let embed: MessageEmbed =
    !track || SongQueue.get().queue.length === 1 && track.state !== ItemState.PLAYING
        ? CommonEmbeds.empty() 
        : CommonEmbeds.queueEmbed()
    await interaction.editReply({ embeds: [embed]});
}