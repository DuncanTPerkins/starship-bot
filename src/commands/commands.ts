import { CommandInteraction, Constants } from "discord.js";
import { next } from "./next";
import { play } from './play';
import { queue } from "./queue";
import { shuffle } from "./shuffle";
import { stop } from "./stop";
import { sup } from './sup';
import { mc } from './mc';

export const commands = [
    {
        name: 'play',
        description: 'plays music',
        options: [
            {
                name: 'query',
                required: true,
                description: 'your shit',
                type: Constants.ApplicationCommandOptionTypes.STRING
            }
        ],
        fn: play
    },
    {
        name: 'stop',
        description: 'stops music',
        fn: stop
    },
    {
        name: 'sup',
        description: 'ask starship bot what the news is',
        fn: sup

    },
    {
        name: 'mc',
        description: 'register the current text channel as a music channel',
        fn: mc
    },
    {
        name: 'next',
        description: 'skips to next song in queue',
        fn: next
    },
    {
        name: 'queue',
        description: 'display the contents of the queue',
        fn: queue
    },
    {
        name: 'shuffle',
        description: 'shuffle the current queue',
        fn: shuffle
    }
]

export async function execCommand(interaction: CommandInteraction) {
    const command = commands.find(cmd => cmd.name === interaction.commandName);
    if (!command) {
        await interaction.reply(`Command: ${interaction.commandName} not found.`);
    } else {
        await command.fn(interaction);
    }
}