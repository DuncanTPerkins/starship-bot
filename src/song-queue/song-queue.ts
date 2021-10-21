import { QueueItem, ItemState } from "./models/queue-item";

export class SongQueue {
    private queue: QueueItem[] = [];

    public constructor() {
    }
    public currentTrack: QueueItem = this.emptyQueueItem();

    private finishedTracks = () => {
        return this.queue.filter(qi => qi.state === ItemState.PLAYED);
    }

    public addTrack(url: string, title: string) {
        this.queue.push(this.initQueueItem(url, title));
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

    public toString = () => {
        let str = 'Queue: \n';
        for(let i = 0; i<this.queue.length; i++) {
            str += `${i+1}: ${this.queue[i].title}\n`;
        }
        return str;
    }

    private initQueueItem(url: string, title: string) {
        return {
            url,
            title,
            state: ItemState.IN_QUEUE
        }
    }

    private emptyQueueItem() {
        return {
            url: '',
            title: '',
            state: ItemState.DEFAULT
        }
    }

    private changeTracks(current: QueueItem, replacement: QueueItem) {
        let a = current.state === ItemState.PLAYING ? current : replacement;
        let b = [current, replacement].find(x => x !== a) || {} as QueueItem;
        a.state = ItemState.PLAYED;
        b.state = ItemState.PLAYING;
        this.currentTrack = b;
    }

    private shuffle = () => {
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
        this.onTrackEnded();
    }
}