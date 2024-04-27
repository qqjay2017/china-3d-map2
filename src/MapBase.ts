import { EventEmitter } from "./EventEmitter";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as d3 from "d3-geo";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { geoProjectionScale } from "./consts";
export class MapSizeInit extends EventEmitter {
  canvas: HTMLCanvasElement | HTMLElement | null;
  pixelRatio = 0;
  width = 0;
  height = 0;

  constructor({ canvas }: { canvas: HTMLCanvasElement | HTMLElement }) {
    super();
    this.canvas = canvas;
    this.pixelRatio = 0;
    this.init();
  }
  init() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = this.pixelRatio || Math.min(window.devicePixelRatio, 2);
  }
  destroy() {
    this.off("resize");
  }
}
// Un
export class MapTimeInit extends EventEmitter {
  start = 0;
  current = 0;
  elapsed = 0;
  delta = 0;
  clock = new THREE.Clock();
  timer = 0;
  stop: any = null;
  constructor() {
    super();
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;

    this.delta = 16;

    this.timer = window.requestAnimationFrame(() => {
      this.tick();
    });
  }
  tick() {
    const e = Date.now();
    (this.delta = e - this.current),
      (this.current = e),
      (this.elapsed = this.current - this.start);
    const t = this.clock.getDelta(),
      s = this.clock.getElapsedTime();
    if ((this.emit("tick", t, s), this.stop))
      return window.cancelAnimationFrame(this.timer), !1;
    this.timer = window.requestAnimationFrame(() => {
      this.tick();
    });
  }
  destroy() {
    (this.stop = !0), this.off("tick");
  }
}

class MapCameraInit {
  sizes;
  scene;
  canvas;
  options;
  instance: any;
  controls!: OrbitControls;
  constructor(
    {
      sizes: e,
      scene: t,
      canvas: s,
    }: {
      sizes: any;
      scene: any;
      canvas: any;
    },
    n = { isOrthographic: !1 }
  ) {
    (this.sizes = e),
      (this.scene = t),
      (this.canvas = s),
      (this.options = Object.assign({ isOrthographic: !1 }, n)),
      this.setInstance(),
      this.setControls();
  }
  setInstance() {
    this.instance = null;
    let e = this.sizes.width / this.sizes.height;
    if (this.options.isOrthographic) {
      let t = 120;
      this.instance = new THREE.OrthographicCamera(
        -t * e,
        t * e,
        t,
        -t,
        0.1,
        2e3
      );
    } else {
      this.instance = new THREE.PerspectiveCamera(45, e, 0.1, 2e3);
    }
    this.instance.position.set(10, 10, 10);
    this.scene.add(this.instance);
  }
  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = !0;
    this.controls.maxDistance = 22;
    this.controls.minDistance = 8;
    this.controls.update();
  }
  resize() {
    (this.instance.aspect = this.sizes.width / this.sizes.height),
      this.instance.updateProjectionMatrix();
  }
  update(t?: any) {
    this.controls.update();
  }
  destroy() {
    this.controls.dispose();
  }
}

class MapRendererInit {
  canvas;
  sizes;
  scene;
  camera;
  postprocessing;
  composer;
  instance!: THREE.WebGLRenderer;
  constructor({
    canvas: e,
    sizes: t,
    scene: s,
    camera: n,
    postprocessing: i,
    composer: r,
  }: any) {
    (this.canvas = e),
      (this.sizes = t),
      (this.scene = s),
      (this.camera = n),
      (this.postprocessing = i),
      (this.composer = r),
      this.setInstance();
  }
  setInstance() {
    (this.instance = new THREE.WebGLRenderer({
      alpha: !0,
      antialias: !0,
      canvas: this.canvas,
    })),
      this.instance.setSize(this.sizes.width, this.sizes.height),
      this.instance.setPixelRatio(this.sizes.pixelRatio);
  }
  resize() {
    this.instance?.setSize(this.sizes.width, this.sizes.height),
      this.instance?.setPixelRatio(this.sizes.pixelRatio);
  }
  update(t?: any) {
    this.postprocessing && this.composer
      ? this.composer.render()
      : this.instance?.render(this.scene, this.camera.instance);
  }
  destroy() {
    this.instance?.dispose(), this.instance?.forceContextLoss();
  }
}
export type MapBaseConfig = {
  geoProjectionCenter?: [number, number];
  geoProjectionTranslate?: [number, number];
  geoProjectionScale?: number;
  isOrthographic?: boolean;
};
export class MapBase extends EventEmitter {
  config: MapBaseConfig = {};
  canvas;
  scene: THREE.Scene;
  sizes: MapSizeInit;
  time: MapTimeInit;
  camera: MapCameraInit;
  renderer: MapRendererInit;
  geoProjection;
  constructor(
    canvas: HTMLCanvasElement | HTMLElement,
    config: MapBaseConfig = {}
  ) {
    super();
    this.geoProjection = (data: any) => {
      let { geoProjectionCenter, geoProjectionScale, geoProjectionTranslate } =
        this.config;
      return (
        d3
          .geoMercator()
          .center(geoProjectionCenter!)
          .scale(geoProjectionScale!)
          .translate(geoProjectionTranslate!)(data) || [0, 0]
      );
    };
    const defaultConfig: MapBaseConfig = {
      geoProjectionCenter: [0, 0],
      geoProjectionScale: geoProjectionScale,
      geoProjectionTranslate: [0, 0],
      isOrthographic: !1,
    };
    this.config = {
      ...defaultConfig,
      ...config,
    };
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.sizes = new MapSizeInit({ canvas });
    this.time = new MapTimeInit();
    this.camera = new MapCameraInit(
      {
        sizes: this.sizes,
        scene: this.scene,
        canvas: this.canvas,
      },
      {
        isOrthographic: !!this.config.isOrthographic,
      }
    );
    this.renderer = new MapRendererInit(this);
    this.sizes.on("resize", () => {
      this.resize();
    });
    this.time.on("tick", (i: any) => {
      this.update(i);
    });
  }
  setAxesHelper(t = 250) {
    if (!t) return !1;
    let s = new THREE.AxesHelper(t);
    this.scene.add(s);
  }
  resize() {
    this.camera.resize(), this.renderer.resize();
  }
  update(t?: any) {
    this.camera.update(t), this.renderer.update(t);
  }
  destroy() {
    this.sizes.destroy();
    this.time.destroy();
    this.camera.destroy();
    this.renderer.destroy();
    this.scene.traverse((t: any) => {
      if (t && t.geometry && t.geometry.dispose) {
        t.geometry.dispose();
        for (const s in t.material) {
          const n = t.material[s];
          n && typeof n.dispose == "function" && n.dispose();
        }
      }
    }),
      this.canvas?.parentNode?.removeChild(this.canvas);
  }
}

let AllLoaderMap: Record<string, string> = {
  GLTFLoader: "GLTF",
  TextureLoader: "Texture",
  FontLoader: "Font",
  MMDLoader: "MMD",
  MTLLoader: "MTL",
  OBJLoader: "OBJ",
  PCDLoader: "PCD",
  FileLoader: "File",
  ImageLoader: "Image",
  ObjectLoader: "Object",
  MaterialLoader: "Material",
  CubeTextureLoader: "CubeTexture",
  RGBELoader: "RGBELoader",
  FBXLoader: "FBX",
};

const ws = Object.values(AllLoaderMap);
export class MapLoaderInit extends EventEmitter {
  dracoPath;
  itemsLoaded;
  itemsTotal;
  assets: any[];
  loaders: any;
  manager: any;
  constructor({ dracoPath: e }: { dracoPath?: string } = { dracoPath: "" }) {
    super(),
      (this.dracoPath = e || "./draco/gltf/"),
      (this.itemsLoaded = 0),
      (this.itemsTotal = 0),
      (this.assets = []),
      (this.loaders = {}),
      this.initDefaultLoader();
  }
  initManager() {
    const e = new THREE.LoadingManager();
    return (
      (e.onProgress = (t, s, n) => {
        (this.itemsLoaded = s),
          (this.itemsTotal = n),
          this.emit("onProgress", t, s, n);
      }),
      (e.onError = (t) => {
        this.emit("onError", t);
      }),
      e
    );
  }
  initDefaultLoader() {
    [
      { loader: GLTFLoader, name: "GLTFLoader" },
      { loader: THREE.TextureLoader, name: "TextureLoader" },
    ].map((e) => this.addLoader(e.loader, e.name));
  }
  initDraco(e: any) {
    const t = new DRACOLoader();
    t.setDecoderPath(this.dracoPath), t.preload(), e.setDRACOLoader(t);
  }
  addLoader(e: any, t = "") {
    if (e.name && AllLoaderMap[t]) {
      if (!this.loaders[t]) {
        let n = new e(this.manager),
          i = t;

        i === "GLTFLoader" && this.initDraco(n),
          (this.loaders[AllLoaderMap[i]] = n);
      }
    } else throw new Error("请配置正确的加载器");
  }
  loadItem(e: any) {
    return new Promise((t, s) => {
      if (!this.loaders[e.type]) throw new Error(`资源${e.path}没有配置加载器`);
      this.loaders[e.type].load(
        e.path,
        (n: any) => {
          this.itemsLoaded++,
            this.emit("onProgress", e.path, this.itemsLoaded, this.itemsTotal),
            t({ ...e, data: n });
        },
        null,
        (n: any) => {
          this.emit("onError", n), s(n);
        }
      );
    });
  }
  loadAll(e: any) {
    return (
      (this.itemsLoaded = 0),
      (this.itemsTotal = 0),
      new Promise((t, s) => {
        let n = this.matchType(e),
          i: any[] = [];
        (this.itemsTotal = n.length),
          n.map((r) => {
            let c = this.loadItem(r);
            i.push(c);
          }),
          Promise.all(i)
            .then((r) => {
              (this.assets = r), this.emit("onLoad"), t(r);
            })
            .catch((r) => {
              this.emit("onError", r), s(r);
            });
      })
    );
  }
  matchType(e: any[]) {
    return (
      (this.assets = e
        .map((t) => ({
          type: ws.includes(t.type) ? t.type : "",
          path: t.path,
          name: t.name,
          data: null,
        }))
        .filter((t) => {
          if (!t.type) throw new Error(`资源${t.path},type不正确`);
          return t.type;
        })),
      this.assets
    );
  }
  getResource(e: any) {
    let t = this.assets.find((s) => s.name === e);
    if (!t) throw new Error(`资源${e}不存在`);
    return t.data;
  }
  destroy() {
    this.off("onProgress"),
      this.off("onLoad"),
      this.off("onError"),
      (this.assets = []);
  }
}
