import { AudioPlayer, AudioPlayerStatus, createAudioResource, DiscordGatewayAdapterCreator, joinVoiceChannel, VoiceConnection } from "@discordjs/voice"
import { VoiceChannel } from "discord.js";
import ytdl from "ytdl-core";
import ytsr, { Video } from "ytsr";

export class AudioStreamer {
    private audioPlayer: AudioPlayer;
    private connection: VoiceConnection | null = null;
    private static instance: AudioStreamer;
    public constructor() {
        this.audioPlayer = new AudioPlayer();
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

    public getAudioPlayer(url: string) {
        const stream = ytdl(url, { filter: 'audioonly' });
        if (this.connection) {
            this.connection.subscribe(this.audioPlayer);
            this.audioPlayer.play(createAudioResource(stream));
            return this.audioPlayer;
        }
    }

    public async getStreamableAsset(query: string) {
        const results = await ytsr(query!, { limit: 1 }); // just grab first result for now
        return results.items[0] as Video
    }

    public stop() {
        this.audioPlayer.stop();
    }

    public disconnect() {
        if (!this.connection) {
            return null;
        }
        this.connection.destroy();
    }
}