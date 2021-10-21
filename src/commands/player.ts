import { AudioPlayer, AudioPlayerStatus, VoiceConnection } from "@discordjs/voice";

let _audioplayer: AudioPlayer;
let _connection: VoiceConnection;

export function getAudioPlayer(connection: VoiceConnection) {
    if (!_audioplayer) {
        _audioplayer = new AudioPlayer();
        _connection = connection
        _audioplayer.on('error', error => console.error(error));
        _audioplayer.on(AudioPlayerStatus.Idle, () => _connection.destroy());
    }
    return _audioplayer;
}

export function stopAudioPlayer() {
    if (_connection && _audioplayer) {
        _audioplayer.stop();
    }
}