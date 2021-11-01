import { URLSearchParams } from "url";
import ytpl from "ytpl";
import { SongQueue } from "../song-queue/song-queue";

export async function YoutubePlaylistToQueueItems(playlistUrl: string) {
    const queue = SongQueue.get();
    const urlParams = new URLSearchParams(playlistUrl);
    let tracks;
    try {
        tracks = await ytpl (urlParams.get('list') || '');
        tracks.items.forEach(i => queue.addTrack(i.url, i.title));
    } catch (e) {
        return null;
    }
    return [tracks.url, tracks.title];
}

export function IsYoutubePlaylist(playlistUrl: string) {
    const playlistIndicators = ['/playlist', 'list='];
    return playlistIndicators.some(indicator => playlistUrl.includes(indicator))
}