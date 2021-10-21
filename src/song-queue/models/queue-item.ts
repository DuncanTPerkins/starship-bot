export interface QueueItem {
    url: string;
    state: ItemState,
    title: string
}

export const enum ItemState {
    'IN_QUEUE' = 0,
    'PLAYING',
    'PLAYED',
    'DEFAULT'
}