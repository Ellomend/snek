import {Board} from "./Board";
import {Snake} from "./Snake";
import {Food} from "./Food";
import * as THREE from "three";


export class Game {
    canvas: any;
    width: number;
    height: number;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    light: THREE.PointLight;
    score: number;
    scoreText: string;
    snakeSpeed: number;
    snakeSpeedStep: number;
    board: Board;
    snake: Snake;
    food: Food;
    pauseFlag: boolean;
    startTime: number;
    window: any;

    constructor(window) {
        this.window = window;
        this.canvas = window.document.getElementById("game");
        this.width = 20;
        this.height = 20;
        this.score = 0;
        this.scoreText = 'Score: ' + this.score;

        this.snakeSpeed = 2;
        this.snakeSpeedStep = 1;
        this.pauseFlag = false;

        this.initScene();
        this.initCamera();

        // background color
        this.scene.background = new THREE.Color('lightBlue');
        this.initRenderer();
        this.initLight();
        this.initBoard();

        this.initSnake();
        this.initFood();
        this.renderer.render(this.scene, this.camera);
    }

    private initSnake() {
        this.snake = new Snake(this.scene);
        this.snake.startingSnake()
    }

    private initFood() {
        this.food = new Food();
        this.scene.add(this.food.mesh);
        this.food.setMeshPosition(-10, 1);
    }

    private initBoard() {
        this.board = new Board(this.width, this.height);
        this.scene.add(this.board.mesh);
        this.board.mesh.position.set(0.5, 0.5, 0);
    }

    private initLight() {
        // sunlight
        this.light = new THREE.PointLight(0xffffff, 1.2, 100);

        // this.light = new THREE.PointLight("pink", 1, 100);
        this.light.position.set(0, 0, 20);
        this.scene.add(this.light);
    }

    private initRenderer() {
        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
        this.renderer.setSize(this.canvas.width, this.canvas.height);
    }

    private initScene() {
        this.scene = new THREE.Scene();
        // set scene center to 10, 10
    }

    private initCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            1,
            0.1,
            1000
        );

        this.camera.position.set(0, -7, 17);
        this.camera.rotation.x = 0.5

        this.bindDrag(this.window.document);
        this.scene.add(this.camera);
    }

    public animate(): void {
        requestAnimationFrame(() => this.animate());
        this.frame();
    }

    // it goes brrrrrr
    public frame(): void {
        if (Date.now() - this.startTime > this.calculateTurnSpeedDelta()) {
            this.startTime = Date.now();
            this.turn()
        }
    }

    // this goes with snake speed
    public turn() {

        console.log('turn');
        if (!this.pauseFlag) {
            // ALL THE LOGIC
            console.log("no pause");
            // check for collision

            console.log('check collision');
            if (this.checkWallCollision() || this.checkSnakeCollision()) {
                this.gameOver();
            }

            console.log('check food');
            // check for food
            if (this.checkFood()) {
                // update score
                this.score++;
                this.scoreText = "Score: " + this.score;
                this.bumpSnakeSpeed();

                // generate new food
                this.respawnFood();

                // add new part to snake
                this.snake.addPart();
            }

            // update game state
            console.log('update snake');
            this.snake.update();

            // render scene
            this.renderer.render(this.scene, this.camera);
        }
    }

    private respawnFood() {
        const newPosition = this.board.getRandomPosition();
        this.food.setMeshPosition(newPosition.x, newPosition.y);
    }

    // progressivly increase snake speed
    // using square root function
    public calculateTurnSpeedDelta(): number {
        return Math.sqrt(this.snakeSpeed) * 111 + 1000;
    }

    start() {
        this.startTime = Date.now();
        this.animate();

    }

    pause() {
        this.pauseFlag = !this.pauseFlag;
    }


    restart() {
        // reset game state
        this.score = 0;
        this.scoreText = "Score: 0";
        this.snakeSpeed = 15;
        this.snakeSpeedStep = 2;
        this.pauseFlag = false;
        this.startTime = Date.now();

        this.initSnake();
        this.respawnFood();
    }


    private checkWallCollision() {
        const x = this.snake.getHead().position.x;
        const y = this.snake.getHead().position.y;
        console.log('check wc x, y', x, y);
        return !this.board.checkIfPositionIsOnBoard(x, y);
    }

    private checkSnakeCollision() {
        for (let i = 1; i < this.snake.parts.length; i++) {
            if (this.snake.getHead().position.distanceTo(this.snake.parts[i].position) < 1) {
                return true;
            }
        }
        return false;
    }

    private gameOver() {
        this.pause();
        alert("Game Over");
    }

    private checkFood() {
        return this.snake.getHead().position.distanceTo(this.food.mesh.position) < 1;
    }

    private bumpSnakeSpeed() {
        this.snakeSpeed += this.snakeSpeedStep;
    }

    // bind arrow keys to change direction of snake
    public bindKeys(doc) {
        doc.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "ArrowRight":
                    event.preventDefault();
                    this.snake.direction == 'left' ? this.snake.direction = 'left' : this.snake.direction = 'right';
                    break;
                case "ArrowLeft":
                    event.preventDefault();
                    this.snake.direction == 'right' ? this.snake.direction = 'right' : this.snake.direction = 'left';
                    break;
                case "ArrowUp":
                    event.preventDefault();
                    this.snake.direction == 'down' ? this.snake.direction = 'down' : this.snake.direction = 'up';
                    break;
                case "ArrowDown":
                    event.preventDefault();
                    this.snake.direction == 'up' ? this.snake.direction = 'up' : this.snake.direction = 'down';
                    break;
            }


        });

        // bind start/pause/restart buttons
        doc.getElementById("start").addEventListener("click", () => {
            this.start();
        });

        // doc.getElementById("pause").addEventListener("click", () => {
        //     this.pause();
        // });
        //
        // doc.getElementById("restart").addEventListener("click", () => {
        //     this.restart();
        // });
    }

    // bind canvas drag to change camera position
    public bindDrag(doc) {
        let mouseDown = false;
        let lastX = 0;
        let lastY = 0;

        this.canvas.addEventListener("mousedown", (event) => {
            mouseDown = true;
            lastX = event.clientX;
            lastY = event.clientY;
        });

        doc.addEventListener("mouseup", (event) => {
            mouseDown = false;
        });

        doc.addEventListener("mousemove", (event) => {
            if (mouseDown) {
                // delta is how much mouse moved since last frame
                const deltaX = event.clientX - lastX;
                const deltaY = event.clientY - lastY;

                const newX = this.camera.position.x + deltaX * 0.1;
                const newY = this.camera.position.y - deltaY * 0.1;
                this.camera.position.set(newX, newY, this.camera.position.z);
                // // camera follows center of scene
                this.camera.lookAt(0, 0, 0);
                // and stays vertical
                this.camera.up = new THREE.Vector3(0, 0, 1);
                this.renderer.render(this.scene, this.camera);

                lastX = event.clientX;
                lastY = event.clientY;
            }
        });
    }
}
