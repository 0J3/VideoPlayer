declare const isDebug: boolean;
declare const start: number;
declare const initHover: (moveTimeout: number) => void;
declare let volItem: HTMLElement;
declare const initControls: () => void;
declare const seek: (time: number) => any;
declare class Keybind {
    key: string;
    callback: () => any;
    constructor(key: string, callback: () => any);
}
declare class Keymap {
    set(keyBind: Keybind): void;
    get(keyName: string): Keybind | "KeybindDoesNotExist";
}
//# sourceMappingURL=../ts/js/clientCode.d.ts.map