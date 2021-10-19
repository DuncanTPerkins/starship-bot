import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Client } from 'discord.js';
import { commands, execCommand } from './commands/commands';
import { Secrets } from './secrets';

const rest = new REST({ version: '9' }).setToken(Secrets.token);
const client = new Client({ intents: ['GUILDS', 'GUILD_VOICE_STATES', 'GUILD_MESSAGES',] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  else execCommand(interaction);
});

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(Secrets.clientId, Secrets.starshipId),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.login(Secrets.token);



