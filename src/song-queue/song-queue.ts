import { QueueItem, ItemState } from "./models/queue-item";
import { BehaviorSubject } from 'rxjs';

export class SongQueue {
    private static instance: SongQueue;
    public trackChanged: BehaviorSubject<QueueItem | null>;
    public currentTrack: QueueItem;
    private queue: QueueItem[] = [];

    public static get() {
        if (!SongQueue.instance) {
            SongQueue.instance = new SongQueue();
        }
        return SongQueue.instance;
    }

    public constructor() {
        this.currentTrack = this.initQueue.empty();
        this.trackChanged = new BehaviorSubject<QueueItem | null>(null);
    }

    public addTrack(url: string, title: string) {
        const queueItem: QueueItem = this.queue.length === 0 
            ? this.initQueue.playing(url, title) 
            : this.initQueue.inQueue(url, title);
        this.queue.push(queueItem);
        return queueItem.state;
    }

    public onTrackEnded = () => {
        const tracks = this.queue.filter(qi => qi.state === ItemState.IN_QUEUE);
        if (!tracks) {
            return null;
        }
        this.changeTracks(this.currentTrack, tracks[0]);
        return this.currentTrack;
    }

    public onReverse = () => {
        const finishedTracks = this.queue.filter(qi => qi.state === ItemState.PLAYED);
        this.changeTracks(finishedTracks[finishedTracks.length - 1], this.currentTrack);
        return this.currentTrack;
    }

    public shuffle = () => {
        //Fisher-Yates shuffle
        let index = this.queue.length
        let randomIndex = 0;
        while (index) {
            randomIndex = Math.floor(Math.random() * index);
            index--;
            [this.queue[index], this.queue[randomIndex]]
                =
                [this.queue[randomIndex], this.queue[index]];
        }
        this.trackChanged.next(this.onTrackEnded());
    }

    public clearQueue() {
        this.queue = [this.initQueue.empty()];
    }

    public toString = () => {
        let str = 'Queue: \n';
        for (let i = 0; i < this.queue.length; i++) {
            str += `${i + 1}: ${this.queue[i].title}\n`;
        }
        return str;
    }

    private finishedTracks = () => {
        return this.queue.filter(qi => qi.state === ItemState.PLAYED);
    }

    private initQueue = {
        empty: () => {
            return {
                url: '',
                title: '',
                state: ItemState.DEFAULT
            } as QueueItem
        },
        inQueue: (url: string, title: string) => {
            return {
                url,
                title,
                state: ItemState.IN_QUEUE
            } as QueueItem
        },
        playing: (url: string, title: string) => {
            return {
                url,
                title,
                state: ItemState.PLAYING
            } as QueueItem
        }
    }

    private changeTracks(current: QueueItem, replacement: QueueItem) {
        let a = [ItemState.PLAYING, ItemState.DEFAULT].includes(current.state)  ? current : replacement;
        let b = [current, replacement].find(x => x !== a) || {} as QueueItem;
        a.state = ItemState.PLAYED;
        b.state = ItemState.PLAYING;
        this.currentTrack = b;
        this.trackChanged.next(this.currentTrack);
    }
}