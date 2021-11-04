export interface QueueItem {
    url: string;
    state: ItemState,
    title: string,
    thumbnail?: string
}

export const enum ItemState {
    'IN_QUEUE' = 0,
    'PLAYING' = 1,
    'PLAYED' = 2,
    'DEFAULT' = 3
}