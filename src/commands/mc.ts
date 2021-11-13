import { CommandInteraction, MessageEmbed, TextChannel } from "discord.js";
import { CommonEmbeds } from "../common/common-embeds";
import { getDb } from "../db/db";

export async function mc(interaction: CommandInteraction) {
    const result = await registerMC(interaction.channelId);
    if (result instanceof Error) {
        console.error(result);
        interaction.reply({
            embeds: [CommonEmbeds.error('registering the music channel. This channel is probably already registered.')],
            ephemeral: true
        });
        return;
    } else {
        const { name } = interaction.guild?.channels.cache.get(interaction.channelId) as TextChannel;
        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle('Success registering music channel')
                    .setFields([{ name: 'Channel Name', value: name }, { name: 'Channel Id', value: interaction.channelId }])
                    .setColor('#f73772')
            ], ephemeral: true
        });
    }
}


export async function registerMC(channelId: string): Promise<any> {
    const db = await getDb();
    try {
        const result = await db.run(`INSERT INTO MUSIC_CHANNEL (channel_id) VALUES (${channelId})`);
        db.close();
        return result;
    } catch (e: any) {
        console.error(e);
        db.close();
        return e;
    }
}

export async function checkMC(channelId: string): Promise<any> {
    const db = await getDb();
    try {
        const { channel_id } = await db.get(`SELECT CAST(channel_id AS TEXT) AS channel_id FROM MUSIC_CHANNEL WHERE channel_id = ${channelId}`) || {};
        db.close();
        return channel_id === channelId;
    } catch (e: any) {
        console.error(e);
        db.close();
        return e;
    }
}

export async function getMC(): Promise<any> {
    const db = await getDb();
    try {
        const result = await db.get(`SELECT CAST(channel_id AS TEXT) AS channel_id FROM MUSIC_CHANNEL`);
        db.close();
        return result;
    } catch (e: any) {
        console.error(e);
        db.close();
        return e;
    }
}

export async function getWrongMcResponse(interaction: CommandInteraction) {
    const { channel_id } = await getMC() || {};
    if (!channel_id) {
        interaction.reply(
            { embeds: [CommonEmbeds.error('retrieving the music channel. Try registering one with /mc')], ephemeral: true }
        );
        return;
    }
    const { name } = interaction.guild?.channels.cache.get(channel_id.toString()) as TextChannel;
    interaction.reply({
        embeds: [
            new MessageEmbed()
                .setTitle('No...')
                .setDescription(`Music commands can only be used in the registered music channel: ${name}`)
                .setColor('#f73772')
        ],
        ephemeral: true
    });
}