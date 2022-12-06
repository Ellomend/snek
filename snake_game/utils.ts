/*
 * Copyright (c) 2022.
 *
 */
import * as THREE from "three";
import {Color} from "three";


export const changeCoords = (x, y, direction) => {
    switch (direction) {
        case "up":
            return [x, y + 1];
        case "down":
            return [x, y - 1];
        case "left":
            return [x - 1, y];
        case "right":
            return [x + 1, y];
    }
}


/**
 * @param width
 * @param height
 * @param depth
 */
export function getBoxGeometry(width: number = 1, height: number = 1, depth: number = 1): THREE.BoxGeometry {
    return new THREE.BoxGeometry(width, height, depth);
}

/**
 * @param color
 */
export function getMeshPhongMaterial(color: Color | string | number | undefined = 0xff0000) {
    return new THREE.MeshPhongMaterial({color: color});
}

export function getBoxMesh(geometry: THREE.BoxGeometry, material: THREE.Material) {
    return new THREE.Mesh(geometry, material);
}