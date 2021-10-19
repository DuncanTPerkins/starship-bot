import { AudioPlayer } from "@discordjs/voice"

let _audioplayer: AudioPlayer;

export function getAudioPlayer() {
    if (!_audioplayer) {
        _audioplayer = new AudioPlayer();
    }
    return _audioplayer;
}