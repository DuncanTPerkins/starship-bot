import { Routes } from 'discord-api-types/v9';
import { REST } from '@discordjs/rest';
import { Client, Intents } from 'discord.js';
import { Secrets }  from './src/secrets';

const commands = [{
    name: 'sup',
    description: 'ask starship bot what the news is'
}]
const rest = new REST({ version: '9'}).setToken(Secrets.env.token || '');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
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
        Routes.applicationGuildCommands(Secrets.env.clientId || '', Secrets.env.starshipId || ''),
        { body: commands },
      );
  
      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
  })();

  client.login(Secrets.env.token);