import { CommandInteraction, Constants } from "discord.js";
import { play } from './play';
import { stop } from "./stop";
import { sup } from './sup';

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
]

export async function execCommand(interaction: CommandInteraction) {
    const command = commands.find(cmd => cmd.name === interaction.commandName);
    if (!command) {
        await interaction.reply(`Command: ${interaction.commandName} not found.`);
    } else {
        command.fn(interaction);
    }
}