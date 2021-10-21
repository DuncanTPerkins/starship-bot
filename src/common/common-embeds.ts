import { MessageEmbed } from "discord.js";

export const CommonEmbeds = {
    queueing: (title: string, url: string) => {
        return CommonEmbeds.baseEmbed('Adding to Queue', title, url);
    },
    nowPlaying: (title: string, url: string) => {
        return CommonEmbeds.baseEmbed('Now Playing', title, url);
    },
    shuffle: () => { 
        return new MessageEmbed()
        .setTitle(`Shuffling!`)
        .setColor('#f73772')
    },
    baseEmbed: (message: string, title: string, url: string) => {
        return new MessageEmbed()
        .setTitle(`📀 ${ message }: \`${ title }\``)
        .setColor("#f73772")
        .addField(title, url);
    }
}