import { MessageEmbed } from "discord.js";
import { SongQueue } from "../song-queue/song-queue";

export const CommonEmbeds = {
    queueing: (title: string, url: string) => {
        return CommonEmbeds.baseEmbed('Adding to Queue', title, url);
    },
    nowPlaying: (title: string, url: string) => {
        return CommonEmbeds.baseEmbed('Now Playing', title, url);
    },
    shuffle: () => { 
        return new MessageEmbed()
        .setDescription(`Shuffling!`)
        .setColor('#f73772')
    },
    baseEmbed: (message: string, title: string, url: string) => {
        return new MessageEmbed()
        .setTitle(`📀 ${ message }: \`${ title }\``)
        .setColor("#f73772")
        .addField(title, url);
    },
    queueEmbed: () => {
        return new MessageEmbed()
            .setTitle("🥺 Here's your Queue 🥺")
            .setURL("https://github.com/DuncanTPerkins/starship-bot")
            .setColor(0x00AE86)
            .setDescription(SongQueue.get().toString())
            .setFooter("I drop the mic like I'm mental, it's a rental, check me out while i sit, my ass is like Mel Brooks")
            .setImage("https://c.tenor.com/gcPMhgpoC4sAAAAC/hhk-cutting-into-the-queue.gif")
    },
    error: (context: string) => {
        return new MessageEmbed()
        .setTitle(`😔 An error occurred while ${context} 😔`)
        .setColor(0x00AE86)
        .setDescription('Sorry about that, you should wait a while and try again, or try with another query.')
    },
    empty: () => {
        return new MessageEmbed()
        .setDescription(`There's nothing queued ya big dummy`)
        .setColor(0x00AE86)
    }
}