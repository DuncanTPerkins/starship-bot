import { createAudioResource, DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice";
import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import ytdl from "ytdl-core";
import ytsr, { Video } from "ytsr";
import { checkMC, getWrongMcResponse } from "./mc";
import { getAudioPlayer } from "./player";

export async function play(interaction: CommandInteraction) {
    if (await !checkMC(interaction.channelId)) {
        await getWrongMcResponse(interaction);
        return;
    }
    const channel = (interaction.member as GuildMember).voice.channel;
    const connection = joinVoiceChannel({
        channelId: channel!.id,
        guildId: channel!.guild.id,
        adapterCreator: channel!.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
    });

    const searchQuery = interaction.options.getString('query');
    const results = await ytsr(searchQuery!, { limit: 1 }); // just grab first result for now
    const song: Video = results.items[0] as Video
    const resultsMessage = new MessageEmbed()
        .setTitle(`📀 Search For: \`${searchQuery}\``)
        .setColor("#f73772")
        .addField(song.title, song.url);

    await interaction.reply({ embeds: [resultsMessage] });
    const stream = ytdl(song.url, { filter: 'audioonly' });
    const player = getAudioPlayer(connection);
    connection.subscribe(player);
    player.play(createAudioResource(stream));
}