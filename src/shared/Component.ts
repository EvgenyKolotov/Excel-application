import Emitter from '../core/Emitter';
import Store from '../core/Store';
import { State } from './State';

export interface Component {
    init: () => void;
    toHTML: () => string;
    storeChanged: (data: State) => void;
}

export interface ExcelOptions {
    components: Component[],
    store: Store
}

export interface ComponentOptions {
    emitter: Emitter;
    store: Store
}

export interface ExcelComponentOptions extends ComponentOptions {
    name: string;
    listeners: string[],
    subscribe: string[],
}

export type Subscriber = (data?: State) => void;

export interface Unsubscriiber {
    unsubscribe: () => void;
}