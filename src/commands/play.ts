import { AudioPlayer, AudioPlayerStatus } from "@discordjs/voice";
import { CommandInteraction, GuildMember, VoiceChannel } from "discord.js";
import { AudioStreamer } from "../audio-streamer/audio-streamer";
import { CommonEmbeds } from "../common/common-embeds";
import { IsYoutubePlaylist, YoutubePlaylistToQueueItems } from "../playlist-handlers/youtube-playlist-handler";
import { ItemState, QueueItem } from '../song-queue/models/queue-item';
import { SongQueue } from '../song-queue/song-queue';
import { checkMC, getWrongMcResponse } from "./mc";

export async function play(interaction: CommandInteraction) {
    if (await checkMC(interaction.channelId) === false) {
        await getWrongMcResponse(interaction);
        return;
    }
    await interaction.deferReply();
    const channel = (interaction.member as GuildMember).voice.channel;
    const queue = SongQueue.get();
    const streamer = AudioStreamer.get();
    const query = interaction.options.getString('query');
    const isPlaylist = IsYoutubePlaylist(query || '');
    if (isPlaylist) {
        const result = await YoutubePlaylistToQueueItems(query || '');
        if (!result) {
            await interaction.editReply({ embeds: [CommonEmbeds.error('adding your playlist.')] })
            streamer.disconnect();
            return;
        }
    } else {
        const song = await streamer.getStreamableAsset(query || '');
        if (!song) {
            await interaction.editReply({ embeds: [CommonEmbeds.error('finding a result for your search.')] })
            return;
        }
        const item = queue.addTrack(song.url, song.title, song.bestThumbnail.url || '');
        trackQueued(interaction, item);
    }
    if (!streamer.isPlaying()) {
        streamer.joinChannel(channel as VoiceChannel);
        let player = streamer.getAudioPlayer(queue?.currentTrack?.url || '');
        if (player instanceof Error) {
            interaction.reply({ embeds: [CommonEmbeds.error('getting this track.')] });
            return;
        }
        if (player instanceof AudioPlayer) {
            const trackChanged = queue.trackChanged.subscribe((queueItem) => {
                if (!queueItem || !queueItem.url || isPlaylist) {
                    return;
                }
                player = streamer.getAudioPlayer(queueItem.url);
                if (!player) {
                    queue.clearQueue();
                    streamer.disconnect();
                    return;
                }
            });
            player.on(AudioPlayerStatus.Idle, () => {
                trackChanged.unsubscribe();
                queue.clearQueue();
                streamer.disconnect();
                return;
            });
        }
    }
}

export async function trackQueued(interaction: CommandInteraction, item: QueueItem | undefined = undefined, playlist?: any) {
    const queue = SongQueue.get();
    item = playlist
        ? { title: playlist[1], url: playlist[0], thumbnail: playlist[3], state: ItemState.DEFAULT }
        : item ? item : queue.currentTrack || undefined

    const resultsMessage = CommonEmbeds.queueing(item?.title || '', item?.url || '', item?.thumbnail || '');
    await interaction.editReply({ embeds: [resultsMessage] });
}