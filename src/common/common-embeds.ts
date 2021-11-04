import { MessageEmbed } from "discord.js";
import { SongQueue } from "../song-queue/song-queue";

const GIFS = [
    'https://i.pinimg.com/originals/de/8f/42/de8f42e5fc24d1a1cef1549e68b4e429.gif',
    'https://c.tenor.com/0hjOGLFaQa0AAAAd/lofi-girl-lofi.gif',
    'https://media1.giphy.com/media/ujTVMASREzuRbH6zy5/giphy.gif',
    'https://c.tenor.com/C28ZmOboAlwAAAAM/dancing-jew-jewish-dance.gif',
    'https://media.giphy.com/media/1398cRUI5r3aww/giphy.gif',
    'https://i.imgur.com/wU2ziSQ.gif',
    'https://i.imgur.com/RLpHHyZ.gif',
    'https://c.tenor.com/Y5FIRkOAIe8AAAAM/shaktii-nuclear-missile-at-the-indian-armys-pokhran-test-range-in-rajasthan-gif.gif',
]

export const CommonEmbeds = {
    queueing: (title: string, url: string, thumbnail?: string) => {
        return CommonEmbeds.musicEmbed('Adding to Queue:', title, url, thumbnail);
    },
    nowPlaying: (title: string, url: string, thumbnail?: string) => {
        return CommonEmbeds.musicEmbed('Now Playing:', title, url, thumbnail);
    },
    musicEmbed: (message: string, songTitle: string, url: string, thumbnail?: string) => {
        return new MessageEmbed()
            .setTitle(message)
            .setDescription(`[${songTitle}](${url})`)
            .setThumbnail(getRandomGif()) // message thumbnail
            .setImage(thumbnail || '') // track thumbnail
            .setColor("#f73772")
            .setTimestamp()
            .setFooter('powered by DachPercott™')
    },
    queueEmbed: () => {
        return new MessageEmbed()
            .setTitle("🥺 Here's your Queue 🥺")
            .setThumbnail(getRandomGif())
            .setURL("https://github.com/DuncanTPerkins/starship-bot")
            .setColor(0x00AE86)
            .setDescription(SongQueue.get().toString())
            .setImage("https://c.tenor.com/gcPMhgpoC4sAAAAC/hhk-cutting-into-the-queue.gif")
            .setTimestamp()
            .setFooter('powered by DachPercott™')
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

function getRandomGif() {
    return GIFS[Math.floor(Math.random() * GIFS.length)];
}