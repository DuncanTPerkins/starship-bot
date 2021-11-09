import { BehaviorSubject } from 'rxjs';
import { ItemState, QueueItem } from "./models/queue-item";

export class SongQueue {
    private static instance: SongQueue;
    public trackChanged: BehaviorSubject<QueueItem | null>;
    public currentTrack: QueueItem | null = null;
    public queue: QueueItem[] = [];

    public static get(): SongQueue {
        if (!SongQueue.instance) {
            SongQueue.instance = new SongQueue();
        }
        return SongQueue.instance;
    }

    public constructor() {
        this.queue = [];
        this.trackChanged = new BehaviorSubject<QueueItem | null>(null);
    }

    public addTrack(url: string, title: string, thumbnail?: string): QueueItem {
        const queueItem: QueueItem = this.initQueueItem(url, title, thumbnail);
        if (!this.currentTrack) {
            this.queue = [queueItem]
            this.changeTracks(queueItem);
        } else {
            this.queue.push(queueItem);
        }
        return queueItem;
    }

    public getSongsInQueue(): QueueItem[] {
        return this.queue.filter(q => q.state === ItemState.IN_QUEUE);
    }

    private getFinishedTracks(): QueueItem[] {
        return this.queue.filter(qi => qi.state === ItemState.PLAYED);
    }

    public isEmpty(): boolean {
        return !this.queue || this.queue.length === 0;
    }

    private changeTracks(track: QueueItem) {
        if (this.currentTrack) {
            this.currentTrack.state = ItemState.PLAYED;
        }
        this.currentTrack = track;
        track.state = ItemState.PLAYING;
        this.trackChanged.next(this.currentTrack);
    }

    public onTrackEnded(): QueueItem | null {
        const tracks = this.getSongsInQueue();
        if (!tracks || tracks.length === 0) {
            this.clearQueue();
            return null;
        }
        this.changeTracks(tracks[0]);
        return this.currentTrack;
    }

    public onReverse(): QueueItem | null {
        const finishedTracks = this.getFinishedTracks();
        if (!finishedTracks || finishedTracks.length === 0) {
            console.error('Error trying to reverse');
            return null;
        }
        this.changeTracks(finishedTracks[finishedTracks.length - 1]);
        return this.currentTrack;
    }

    public shuffle() {
        //Fisher-Yates shuffle
        let index = this.queue.length
        let randomIndex = 0;
        while (index) {
            randomIndex = Math.floor(Math.random() * index);
            index--;
            [this.queue[index], this.queue[randomIndex]] = [this.queue[randomIndex], this.queue[index]];
        }
        this.onTrackEnded();
    }

    public clearQueue() {
        this.queue = [];
        this.currentTrack = null;
    }

    public toString(): string {
        const currentIndex = this.queue.findIndex(x => x === this.currentTrack);
        const roomAtTheStart = currentIndex - 10 > - 1;
        const lastItem = this.queue[this.queue.length - 1];
        const roomAtTheEnd = currentIndex + 10 < this.queue.length - 1;
        const startIndex = roomAtTheStart ? currentIndex - 10 : 0;
        const endIndex = roomAtTheEnd ? currentIndex + 10 : this.queue.length;
        let str = '```diff\n';
        str += roomAtTheStart ? '.  .  .\n' : '';
        for (let i = startIndex; i < endIndex; i++) {
            let character = i < currentIndex ? '- ' : currentIndex < i ? '   ' : '+  '
            str += `${character} ${i + 1}: ${this.queue[i].title}\n`;
        }
        str += roomAtTheEnd ? `    .  .  .\n    ${this.queue.length - 1}: ${lastItem.title}` : '';
        str += '```';
        return str;
    }

    private initQueueItem(url: string, title: string, thumbnail?: string): QueueItem {
        return { url, title, thumbnail, state: ItemState.IN_QUEUE } as QueueItem
    }
}