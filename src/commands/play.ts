import { AudioPlayer, AudioPlayerStatus, createAudioResource, DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice";
import { CommandInteraction, GuildMember, MessageEmbed, VoiceChannel } from "discord.js";
import ytsr, { Video } from "ytsr";
import { AudioStreamer } from "../audio-streamer/audio-streamer";
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
                if (!nextUp) {
                    streamer.disconnect();
                    return;
                }
                player = streamer.getAudioPlayer(nextUp.url);
            });
        }
    }

    const resultsMessage = new MessageEmbed()
        .setTitle(`📀 Queueing: \`${song.title}\``)
        .setColor("#f73772")
        .addField(song.title, song.url);

    await interaction.reply({ embeds: [resultsMessage] });
}