
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Client } from 'discord.js';
import { commands, execCommand } from './src/commands/commands';
import { initDb } from './src/db/db';
import { Secrets } from './src/secrets';
import { SpotifyWebApi } from 'spotify-web-api-ts';

const rest = new REST({ version: '9' }).setToken(Secrets.env.token || '');
const client = new Client({ intents: ['GUILDS', 'GUILD_VOICE_STATES', 'GUILD_MESSAGES',] });
const spotify = new SpotifyWebApi({
  clientId: Secrets.env.spotifyClientId,
  clientSecret: Secrets.env.spotifySecret
})
client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
  initDb();
  try {
    spotify.playlists.getPlaylistItems('37i9dQZF1E3aiWKbPI1NqK')
    .then(x => console.log(x));
  } catch(e) {
    console.log(e);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  else await execCommand(interaction);
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