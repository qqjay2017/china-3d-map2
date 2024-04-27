import { MapAnimate } from "./MapAnimate";

import * as THREE from "three";
export const initChinaMap = () => {
  const mapInstance = new MapAnimate(document.getElementById("canvas")!, {
    geoProjectionCenter: [120.109913, 29.181466],
  });
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  mapInstance.scene.add(cube);

  return mapInstance;
};
