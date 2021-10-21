import { CommandInteraction } from "discord.js";
import { SongQueue } from "../song-queue/song-queue";

export async function queue(interaction: CommandInteraction) {
    interaction.reply(SongQueue.get().toString());
}