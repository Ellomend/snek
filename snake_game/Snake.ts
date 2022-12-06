import * as THREE from "three";
import {getBoxGeometry, getBoxMesh, getMeshPhongMaterial} from "./utils";


export class Snake {
    parts: any[];
    direction: string;
    material: THREE.MeshPhongMaterial;
    geometry: THREE.BoxGeometry;
    scene: any;
    constructor(scene) {

        this.direction = "left";
        this.material = getMeshPhongMaterial("gray" );
        this.geometry = getBoxGeometry(1, 1, 1);
        this.scene = scene;
        this.parts = [];
    }

    public startingSnake() {
        // create snake parts
        for (let i = 0; i < 5; i++) {
            const cube = getBoxMesh(this.geometry, this.material);
            cube.position.set(i, 0, 1);
            this.parts.push(cube);
            this.scene.add(cube);
        }
    }

    // log parts position
    logParts() {
        for (let i = 0; i < this.parts.length; i++) {
            console.log(this.parts[i].position);
        }
    }

    public update() {
        // update the position and rotation of the snake based on its direction
        this.moveHead();

        // move snake parts
        this.moveTrainCarts();

    }

    private moveTrainCarts() {
        for (let i = this.parts.length-1; i < 0; i--) {
            console.log("i: " + i);
            console.log('this.parts[i].position', this.parts[i].position);
            this.parts[i].position.copy(this.parts[i - 1].position);
            console.log('this.parts[i].position', this.parts[i].position);
        }
    }

    private moveHead() {
        const headPosition = this.getHead().position

        console.log('headPosition', headPosition);
        console.log('tailPosition', this.getTail().position);
        switch (this.direction) {
            case "up":
                headPosition.y += 1;
                break;
            case "down":
                headPosition.y -= 1;
                break;
            case "left":
                headPosition.x -= 1;
                break;
            case "right":
                headPosition.x += 1;
                break;
        }
        console.log(' 2 headPosition', this.getHead().position);

        this.getHead().position.set(headPosition);
    }

    // getHead
    getHead() {
        return this.parts[0];
    }

    getTail() {
        return this.parts[this.parts.length - 1];
    }

    setHeadPosition(x, y, z) {
        const head = this.getHead();
        head.position.set(x, y, z);
    }

    public setDirection(direction) {
        // set the direction of the snake
        this.direction = direction;
    }

    checkFood(food) {
        // check if snake has eaten the food
        const head = this.parts[0];
        return head.position.distanceTo(food.position) < 1;

    }

    addPart() {
        // add a new part to the snake
        const cube = getBoxMesh(this.geometry, this.material);
        cube.position.copy(this.parts[this.parts.length - 1].position);
        this.parts.push(cube);
        this.scene.add(cube);
    }
}
