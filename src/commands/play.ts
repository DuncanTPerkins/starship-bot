import { AudioPlayer, AudioPlayerStatus, createAudioResource, DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice";
import { CommandInteraction, GuildMember, MessageEmbed, VoiceChannel } from "discord.js";
import ytsr, { Video } from "ytsr";
import ytpl from "ytpl";
import { AudioStreamer } from "../audio-streamer/audio-streamer";
import { CommonEmbeds } from "../common/common-embeds";
import { ItemState, QueueItem } from '../song-queue/models/queue-item';
import { SongQueue } from '../song-queue/song-queue';
import { checkMC, getWrongMcResponse } from "./mc";
import { IsYoutubePlaylist, YoutubePlaylistToQueueItems } from "../playlist-handlers/youtube-playlist-handler";

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
    let song: Video;
    if (isPlaylist) {
        const result = await YoutubePlaylistToQueueItems(query || '');
        if (!result) {
            await interaction.editReply({ embeds: [CommonEmbeds.error('adding your playlist.')]})
            streamer.disconnect();
            return;
        }
        await trackQueued(interaction, undefined, result)
    } else {
        const song = await streamer.getStreamableAsset(query || '');
        console.log(song);
        if (!song) {
            await interaction.editReply({ embeds: [CommonEmbeds.error('finding a result for your search.')]})
            return;
        }
        const item = await queue.addTrack(song.url, song.title);
        console.log('item', item);
        await trackQueued(interaction, item);
    }
    if (!streamer.isPlaying()) {
        streamer.joinChannel(channel as VoiceChannel);
        let player = streamer.getAudioPlayer(queue?.currentTrack?.url || '');
        if (player) {
            const trackChanged = queue.trackChanged.subscribe((queueItem) => {
                console.log('track changed', queueItem)
                if (!queueItem || !queueItem.url || isPlaylist) {
                    return;
                }
                player = streamer.getAudioPlayer(queueItem.url);
                if (!player) {
                    queue.clearQueue();
                    streamer.disconnect();
                }
            });
            player.on(AudioPlayerStatus.Idle, () => {
                const nextUp = queue.onTrackEnded();
                if (!nextUp || !nextUp.url) {
                    return;
                }
                player = streamer.getAudioPlayer(nextUp.url);
                if (!player) {
                    trackChanged.unsubscribe();
                    queue.clearQueue();
                    streamer.disconnect();
                }
            });
        }
    }
}

export async function trackQueued(interaction: CommandInteraction, item: QueueItem | undefined = undefined, playlist?: any) {
    const queue = SongQueue.get();
    item = playlist 
        ? { title: playlist[1], url: playlist[0], state: ItemState.DEFAULT }
        : item ? item : queue.currentTrack || undefined
    const resultsMessage = CommonEmbeds.queueing(item?.title || '', item?.url || '');
    await interaction.editReply({ embeds: [resultsMessage] });
}