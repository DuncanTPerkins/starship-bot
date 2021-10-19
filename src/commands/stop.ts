import { CommandInteraction } from "discord.js/typings/index.js";
import { getAudioPlayer } from "./player";

export async function stop(interaction: CommandInteraction) {
    getAudioPlayer().stop();
    await interaction.reply('\`🤧 Music stopped\`')
};