import { Routes } from 'discord-api-types'
import { REST } from '@discordjs/rest';
import { Secrets } from './src/secrets';
import { Client, Intents } from 'discord.js';
const commands = [{
    name: 'sup',
    description: 'ask starship bot what the news is'
}]

const rest = new REST({ version: '9'}).setToken(process.env.token || '');
const client = new Client({intents: []});

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'sup') {
    await interaction.reply('mostly just chillin tbh');
  }
});

(async () => {
    try {
      console.log('Started refreshing application (/) commands.');
  
      await rest.put(
        Routes.applicationGuildCommands(process.env.clientId || '', process.env.starshipId || ''),
        { body: commands },
      );
  
      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
  })();

  client.login(Secrets.token);