import {getBoxGeometry, getBoxMesh, getMeshPhongMaterial} from "./utils";

export class Board {
    width: number;
    height: number;
    scene: any;
    mesh: any;

    constructor(width:number, height:number) {
        this.width = width;
        this.height = height;
        this.initBoard();
    }
    public getBoardMesh(wight = 1, height = 1, depth = 1, color = 0x00ff00) {
        let geometry = getBoxGeometry(this.width, this.height, 1);
        let material = getMeshPhongMaterial(color);
        return getBoxMesh()
    }
    private initBoard() {
        this.mesh = this.getBoardMesh(this.scene);
        this.mesh.receiveShadow = true;

        this.mesh.position.set(0, 0, 0);
    }

    // random number between width and height (-10, 10)
    getRandomPosition() {
        return {
            x: Math.floor(Math.random() * (this.width - 1)) - 10,
            y: Math.floor(Math.random() * (this.height - 1)) - 10,
        };
    }
    checkIfPositionIsOnBoard(x, y) {
        const x_range = [this.width / 2, -this.width / 2];
        const y_range = [this.height / 2, -this.height / 2];
        console.log('x_range, y_range', x_range, y_range);
        console.log('x, y', x, y);
        return x >= x_range[1] && x < x_range[0] && y >= y_range[1] && y < y_range[0];
    }


}