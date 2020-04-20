export enum KeyboardKey {
    W,
    A,
    S,
    D,
};

const keyMap: { [key: string]: KeyboardKey } = {
    "W": KeyboardKey.W,
    "A": KeyboardKey.A,
    "S": KeyboardKey.S,
    "D": KeyboardKey.D,
};

// TODO: Update in batches
// Call a method update() on each frame and keep a copy of the arrays
// Provide a wasUpdated() method to reflect changes in eky presses

class KeyboardController {

    private isBind = false;
    //private pressMap: number = 0;
    private pressedArray: KeyboardKey[] = [];

    constructor() {
        console.debug("KeyboardController Ctor");
    }

    bind() {
        if (this.isBind) throw new Error("Keyboard bind twice");
        console.debug("KeyboardController bind");
        this.isBind = true;
        document.addEventListener("keydown", this.onKeyDown.bind(this));
        document.addEventListener("keyup", this.onKeyUp.bind(this));
    }

    isPressed(key: KeyboardKey) {
        return this.pressedArray.includes(key);
        //return (this.pressMap & key) > 0
    }

    private onKeyDown(event: KeyboardEvent) {
        let key = event.key.toUpperCase();

        if (typeof(keyMap[key]) !== "undefined") {
            this.setPressed(keyMap[key]);
        }
    }

    private onKeyUp(event: KeyboardEvent) {
        let key = event.key.toUpperCase();

        if (typeof(keyMap[key]) !== "undefined") {
            this.setNotPressed(keyMap[key]);
        }
    }

    private setPressed(key: KeyboardKey) {
        let idx = this.pressedArray.indexOf(key);
        if (idx >= 0) return;
        this.pressedArray.push(key);
        //this.pressMap |= key;
    }

    private setNotPressed(key: KeyboardKey) {
        let idx = this.pressedArray.indexOf(key);
        if (idx < 0) return;
        this.pressedArray.splice(idx, 1);
        //this.pressMap &= ~key;
    }
}

const INSTANCE = new KeyboardController();

export default INSTANCE;