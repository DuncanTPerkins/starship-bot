import { CommandInteraction } from "discord.js";
import { CommonEmbeds } from "../common/common-embeds";
import { SongQueue } from "../song-queue/song-queue";

export async function shuffle(interaction: CommandInteraction) {
    SongQueue.get().shuffle();
    interaction.reply({ embeds: [CommonEmbeds.shuffle()] })
}