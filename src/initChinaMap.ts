import { MapBase } from "./MapBase";
import * as THREE from "three";
export const initChinaMap = () => {
  const mapInstance = new MapBase(document.getElementById("canvas")!, {});
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  mapInstance.scene.add(cube);
  console.log(mapInstance, "mapInstance");
  return {};
};
