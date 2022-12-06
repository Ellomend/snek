import {BoxGeometry, MeshPhongMaterial} from "three";
import * as THREE from "three";
import {getBoxGeometry, getBoxMesh, getMeshPhongMaterial} from "./utils";
export class Food {

    private geometry: BoxGeometry;
    private _material: MeshPhongMaterial;
    scene: any;
    mesh: THREE.Mesh<BoxGeometry, THREE.Material>;
    constructor() {
        this.initMesh();
    }
    private initMesh() {
        this.geometry = getBoxGeometry(1, 1, 1);
        this._material = getMeshPhongMaterial(0xff0000);
        this.mesh = getBoxMesh(this.geometry, this._material);
        // castShadow
        this.mesh.castShadow = true;
    }
    public setMeshPosition(x, y) {
        this.mesh.position.set(x, y, 1);
    }
}