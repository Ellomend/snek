import {Game} from "./Game";

export class Browser {
    public window: Window;

    private queue: Array<Function>
    game: Game;

    constructor(window: Window) {
        this.window = window;
        this.game = new Game(this.window);
        this.game.bindKeys(window.document);
    }

    public start() {
        this.game.start();
    }


}