import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource, DiscordGatewayAdapterCreator, joinVoiceChannel, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice"
import { VoiceChannel } from "discord.js";
import ytdl from "ytdl-core";
import ytsr, { getFilters, Video } from "ytsr";
import { SongQueue } from "../song-queue/song-queue";

export class AudioStreamer {
    private audioPlayer: AudioPlayer;
    private hasSubscription = false;
    private connection: VoiceConnection | null = null;
    private static instance: AudioStreamer;
    public constructor() {
        this.audioPlayer = createAudioPlayer();
    }

    public static get() {
        if (!AudioStreamer.instance) {
            AudioStreamer.instance = new AudioStreamer();
        }
        return AudioStreamer.instance;
    }

    public joinChannel(channel: VoiceChannel) {
        this.connection = joinVoiceChannel({
            channelId: channel!.id,
            guildId: channel!.guild.id,
            adapterCreator: channel!.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
        });
    }

    public getAudioPlayer(url: string | undefined) {
        if(!url) {
            return null;
        }
        const stream = ytdl(url, { filter: 'audioonly', highWaterMark: 32000 });
        if (!stream) {
            this.disconnect();
            return null;
        }
        if (this.connection && !this.hasSubscription) {
            this.connection.subscribe(this.audioPlayer);
            this.hasSubscription = true;
        }
        this.audioPlayer.play(createAudioResource(stream));
        return this.audioPlayer;
    }

    public isPlaying = () => {
        let is = this.audioPlayer.state.status === AudioPlayerStatus.Playing;
        return is; 
    }

    public async getStreamableAsset(query: string) {
        let filter;
        const ytsrQuery = await getFilters(query)
        const filters = ytsrQuery.get('Type')?.get('Video');
        if (filters && filters.url) {
            const results = await ytsr(filters.url, { limit: 1 }); // just grab first result for now
            if (results) {
                return results.items[0] as Video
            }
        }
        return null;
    }

    public stop() {
        this.audioPlayer.stop();
    }

    public disconnect() {
        if (!this.connection) {
            return null;
        }
        this.hasSubscription = false;
        this.audioPlayer.stop();
        this.connection.destroy();
    }
}