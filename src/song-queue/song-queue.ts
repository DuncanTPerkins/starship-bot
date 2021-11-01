import { QueueItem, ItemState } from "./models/queue-item";
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export class SongQueue {
    private static instance: SongQueue;
    public trackChanged: BehaviorSubject<QueueItem | null>;
    public currentTrack: QueueItem | undefined;
    public queue: QueueItem[] = [];

    public static get() {
        if (!SongQueue.instance) {
            SongQueue.instance = new SongQueue();
        }
        return SongQueue.instance;
    }

    public constructor() {
        this.queue = [];
        this.trackChanged = new BehaviorSubject<QueueItem | null>(null);
    }

    public async addTrack(url: string, title: string) {
        const queueItem: QueueItem = this.queue.length === 0
            ? this.initQueue.playing(url, title)
            : this.initQueue.inQueue(url, title)
        if (!this.currentTrack) {
            this.queue = [queueItem]
            this.currentTrack = queueItem;
            this.trackChanged.next(queueItem);
        } else {
            this.queue.push(queueItem);
        }
        return queueItem;
    }

    public isThereUpNext = () => {
        const isThere = this.queue.filter(q => q.state === ItemState.IN_QUEUE).length > 0
        return isThere;
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
        this.trackChanged.next(this.onTrackEnded() || this.initQueue.empty());
    }

    public clearQueue() {
        this.queue = [];
    }

    public toString = () => {
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
        str += roomAtTheEnd ? `    .  .  .\n    ${this.queue.length - 1}: ${lastItem.title}`  : '';
        str += '```';
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

    private changeTracks(current: QueueItem | undefined, replacement: QueueItem | undefined) {
        if (!replacement) {
            replacement = this.initQueue.empty();
        } 
        if (!current) {
            current = this.initQueue.empty();
        }
        let a = [ItemState.PLAYING, ItemState.DEFAULT].includes(current.state) ? current : replacement;
        let b = [current, replacement].find(x => x !== a) || {} as QueueItem;
        a.state = ItemState.PLAYED;
        b.state = ItemState.PLAYING;
        this.currentTrack = b;
        this.trackChanged.next(this.currentTrack);
    }
}