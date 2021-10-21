
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Client } from 'discord.js';
import { commands, execCommand } from './src/commands/commands';
import { initDb } from './src/db/db';
import { Secrets } from './src/secrets';

const rest = new REST({ version: '9' }).setToken(Secrets.env.token || '');
const client = new Client({ intents: ['GUILDS', 'GUILD_VOICE_STATES', 'GUILD_MESSAGES',] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
  initDb();
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  else execCommand(interaction);
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