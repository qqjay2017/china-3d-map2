import { MapBase, MapBaseConfig } from "./MapBase";
import * as THREE from "three";
// @ts-ignore
import InteractionManager from "three.interaction/src/interaction/InteractionManager.js";

import { MapAssetsLoader } from "./DracoLoader";
import { MapGrid } from "./MapGrid";

export class MapAnimate extends MapBase {
  pointCenter;
  flyLineCenter;
  depth;
  clicked;
  interactionManager;
  eventElement: any[];
  defaultMaterial: null;
  defaultLightMaterial: null;
  assets: MapAssetsLoader;
  stats: any = null;
  constructor(
    _canvas: HTMLCanvasElement | HTMLElement,
    _config: MapBaseConfig = {}
  ) {
    super(_canvas, _config);
    this.pointCenter = [120.109913, 29.181466];
    this.flyLineCenter = [119.476498, 29.898918];
    this.depth = 0.5;
    this.clicked = !1;
    this.scene.fog = new THREE.Fog(1058614, 1, 50);
    this.scene.background = new THREE.Color(1058614);
    this.camera.instance.position.set(
      -13.767695123014105,
      12.990152163077308,
      39.28228164159694
    );
    this.camera.instance.near = 1;
    this.camera.instance.far = 1e4;
    this.camera.instance.updateProjectionMatrix();

    this.interactionManager = new InteractionManager(
      this.renderer.instance,
      this.scene,
      this.camera.instance
      //   this.canvas
    );
    this.eventElement = [];
    this.defaultMaterial = null;
    this.defaultLightMaterial = null;
    this.initSetting();
    this.assets = new MapAssetsLoader(() => {
      console.log("加载静态资源");
      this.initEnvironment();
      this.createFloor();
      this.createChinaBlurLine();
      this.createGrid();
    });
  }
  initSetting() {
    this.renderer.instance.shadowMap.enabled = !1;
    this.renderer.resize();
  }
  update() {
    super.update(),
      this.stats && this.stats.update(),
      this.interactionManager &&
        this.interactionManager.update &&
        this.interactionManager.update(1000);
  }
  // 初始化环境光
  initEnvironment() {
    const globalLight = new THREE.AmbientLight(16777215, 5);
    this.scene.add(globalLight);
    const directionalLight1 = new THREE.DirectionalLight(16777215, 5);
    directionalLight1.position.set(-30, 6, -8);
    directionalLight1.castShadow = !0;
    directionalLight1.shadow.radius = 20;
    directionalLight1.shadow.mapSize.width = 1024;
    directionalLight1.shadow.mapSize.height = 1024;
    this.scene.add(directionalLight1);
    this.createPointLight({
      color: "#1d5e5e",
      intensity: 600,
      distance: 1e4,
      x: -9,
      y: 3,
      z: -3,
    });
    this.createPointLight({
      color: "#1d5e5e",
      intensity: 100,
      distance: 1e4,
      x: 0,
      y: 2,
      z: 5,
    });
  }
  createPointLight(t: {
    color: string;
    intensity: number;
    distance: number;
    x: number;
    y: number;
    z: number;
  }) {
    const a = new THREE.PointLight(1924702, t.intensity, t.distance, 1);
    a.position.set(t.x, t.y, t.z);
    this.scene.add(a);
    return a;
  }
  // 最底下蓝色地图
  createFloor() {
    let planeGeometry = new THREE.PlaneGeometry(20, 20);
    const ocean = this.assets.instance.getResource("ocean");
    ocean.colorSpace = "srgb";
    ocean.wrapS = 1000;
    ocean.wrapT = "1000";
    ocean.repeat.set(1, 1);
    let material = new THREE.MeshBasicMaterial({ map: ocean, opacity: 1 }),
      mesh = new THREE.Mesh(planeGeometry, material);
    mesh.rotateX(-Math.PI / 2);
    mesh.position.set(0, -0.7, 0);
    this.scene.add(mesh);
  }
  //  模糊的中国地图轮廓线
  createChinaBlurLine() {
    let planeGeometry = new THREE.PlaneGeometry(147, 147);
    const chinaBlurLine = this.assets.instance.getResource("chinaBlurLine");
    chinaBlurLine.colorSpace = "srgb";
    chinaBlurLine.wrapS = 1000;
    chinaBlurLine.wrapT = 1000;
    chinaBlurLine.generateMipmaps = !1;

    chinaBlurLine.minFilter = 1003;

    chinaBlurLine.repeat.set(1, 1);

    let meshBasicMaterial = new THREE.MeshBasicMaterial({
      color: 4162253,
      alphaMap: chinaBlurLine,
      transparent: !0,
      opacity: 0.5,
    });
    let mesh = new THREE.Mesh(planeGeometry, meshBasicMaterial);
    mesh.rotateX(-Math.PI / 2);
    mesh.position.set(-33.2, -0.5, -5.2);
    this.scene.add(mesh);
  }
  // 生成圆点
  createGrid() {
    return new MapGrid(this, {
      gridSize: 50,
      gridDivision: 20,
      gridColor: 1788784,
      shapeSize: 0.5,
      shapeColor: 2776970,
      pointSize: 0.1,
      pointColor: 1396093,
      diffuse: !0,
      diffuseSpeed: 10,
      diffuseColor: 3050457,
    });
  }
}
