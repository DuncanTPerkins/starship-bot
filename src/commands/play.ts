import { AudioPlayer, AudioPlayerStatus, createAudioResource, DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice";
import { CommandInteraction, GuildMember, MessageEmbed, VoiceChannel } from "discord.js";
import ytsr, { Video } from "ytsr";
import { AudioStreamer } from "../audio-streamer/audio-streamer";
import { CommonEmbeds } from "../common/common-embeds";
import { ItemState } from "../song-queue/models/queue-item";
import { SongQueue } from "../song-queue/song-queue";

export async function play(interaction: CommandInteraction) {
    if (await checkMC(interaction.channelId) === false) {
        await getWrongMcResponse(interaction);
        return;
    }
    const channel = (interaction.member as GuildMember).voice.channel;
    const queue = SongQueue.get();
    const streamer = AudioStreamer.get();

    const query = interaction.options.getString('query');
    const song = await streamer.getStreamableAsset(query || '');
    if (ItemState.PLAYING === queue.addTrack(song.url, song.title)) {
        streamer.joinChannel(channel as VoiceChannel);
        let player = streamer.getAudioPlayer(song.url);
        if (player) {
            player.on(AudioPlayerStatus.Idle, () => {
                const nextUp = queue.onTrackEnded();
                if (!nextUp || !nextUp.url) {
                    streamer.disconnect();
                    return;
                }
                player = streamer.getAudioPlayer(nextUp.url);
                if (!player) {
                    queue.clearQueue();
                    streamer.disconnect();
                }
            });
        }
    }

    const resultsMessage = CommonEmbeds.queueing(song.url, song.title);
    await interaction.reply({ embeds: [resultsMessage] });
}