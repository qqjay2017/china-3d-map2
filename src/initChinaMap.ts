import { MapAnimate } from "./MapAnimate";

import * as THREE from "three";
export const initChinaMap = () => {
  const mapInstance = new MapAnimate(document.getElementById("canvas")!, {
    // 118.589421,24.908853
    geoProjectionCenter: [118.589421, 24.908853],
  });
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, 0, 0);
  mapInstance.scene.add(cube);

  return mapInstance;
};
