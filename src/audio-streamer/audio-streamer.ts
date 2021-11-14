import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource, DiscordGatewayAdapterCreator, joinVoiceChannel, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";
import { VoiceChannel } from "discord.js";
import ytdl from "ytdl-core";
import ytsr, { getFilters, Video } from "ytsr";

export class AudioStreamer {
    private audioPlayer: AudioPlayer;
    private hasSubscription = false;
    private connection: VoiceConnection | null = null;
    private static instance: AudioStreamer;
    public constructor() {
        this.audioPlayer = createAudioPlayer();
    }

    public static get(): AudioStreamer {
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

    public getAudioPlayer(url: string | undefined): AudioPlayer | Error | null {
        if (!url) {
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
        // https://github.com/fent/node-ytdl-core/issues/932
        const errHandler: any = stream.listeners('error')[2];
        errHandler && stream.removeListener('error', errHandler);
        stream.on('error', (err) => {
            try {
                throw new Error();
            } catch {
                stream.destroy();
                console.log(err);
            }
        });
        return this.audioPlayer;
    }

    public isPlaying(): boolean {
        return this.audioPlayer.state.status === AudioPlayerStatus.Playing;
    }

    public async getStreamableAsset(query: string): Promise<Video | null> {
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
        this.disconnect();
    }

    public disconnect() {
        if (this.connection?.state.status === VoiceConnectionStatus.Disconnected) {
            return null;
        }
        this.hasSubscription = false;
        this.isPlaying() && this.audioPlayer.stop();
        this.connection?.disconnect();
    }
}