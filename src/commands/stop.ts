import { CommandInteraction } from "discord.js/typings/index.js";
import { checkMC, getWrongMcResponse } from "./mc";
import { stopAudioPlayer } from "./player";

export async function stop(interaction: CommandInteraction) {
    if (!checkMC(interaction.channelId)) {
        await getWrongMcResponse(interaction);
        return;
    }
    stopAudioPlayer();
    await interaction.reply('\`🤧 Music stopped\`');
};