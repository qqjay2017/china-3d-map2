import { MapBase, MapBaseConfig } from "./MapBase";
import * as THREE from "three";
// @ts-ignore
import InteractionManager from "three.interaction/src/interaction/InteractionManager.js";

import { MapAssetsLoader } from "./DracoLoader";
import { MapGrid } from "./MapGrid";
import { GradientQuanzhou, GradientShader } from "./GradientShader";
import gsap from "gsap";
import {
  MapInfoData,
  MapLineInfoData,
  MapQuanzhouInfoData,
} from "./MapInfoData";
import { qzCenter } from "./consts";

export class MapAnimate extends MapBase {
  pointCenter;
  flyLineCenter;
  depth;
  clicked;
  interactionManager;
  eventElement: any[];

  assets: MapAssetsLoader;
  stats: any = null;
  rotateBorder1?: THREE.Mesh;
  rotateBorder2?: THREE.Mesh;
  focusMapGroup: THREE.Group = new THREE.Group();
  focusMapTopMaterial: any;
  focusMapSideMaterial: any;
  defaultMaterial?: THREE.MeshStandardMaterial | null;
  defaultLightMaterial?: THREE.MeshStandardMaterial | null;
  quanzhouLineMaterial?: THREE.LineBasicMaterial | null;
  constructor(
    _canvas: HTMLCanvasElement | HTMLElement,
    _config: MapBaseConfig = {}
  ) {
    super(_canvas, _config);
    this.pointCenter = qzCenter;
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
      console.log("加载静态资源完成++开始动画效果");
      this.initEnvironment();
      this.createFloor();
      this.createChinaBlurLine();
      this.createGrid();
      this.createRotateBorder();
      this.createModel();
      // gsap开始
      const tl = gsap.timeline();
      tl.addLabel("focusMap", 2);
      tl.addLabel("focusMapOpacity", 2.5);
      tl.addLabel("bar", 3.5);
      tl.add(
        gsap.to(this.camera.instance.position, {
          duration: 2.5,
          x: -0.2515849818960619,
          y: 12.397744557047988,
          z: 14.647659671139275,
          ease: "circ.out",
        })
      );
      tl.add(
        gsap.to(this.focusMapGroup.position, {
          duration: 1,
          x: 0,
          y: 0,
          z: 0,
        }),
        "focusMap"
      );
      tl.add(
        gsap.to(this.focusMapGroup.scale, {
          duration: 1,
          x: 1,
          y: 1,
          z: 1,
          ease: "circ.out",
        }),
        "focusMap"
      );
      tl.add(
        gsap.to(this.focusMapTopMaterial, {
          duration: 1,
          opacity: 1,
          ease: "circ.out",
        }),
        "focusMapOpacity"
      );
      tl.add(
        gsap.to(this.focusMapSideMaterial, {
          duration: 1,
          opacity: 1,
          ease: "circ.out",
          onComplete: () => {
            this.focusMapSideMaterial.transparent = !1;
          },
        }),
        "focusMapOpacity"
      );
      this.quanzhouLineMaterial &&
        tl.add(
          gsap.to(this.quanzhouLineMaterial, {
            duration: 0.5,
            delay: 0.3,
            opacity: 1,
          }),
          "focusMapOpacity"
        );
      this.rotateBorder1 &&
        tl.add(
          gsap.to(this.rotateBorder1.scale, {
            delay: 0.3,
            duration: 1,
            x: 1,
            y: 1,
            z: 1,
            ease: "circ.out",
          }),
          "focusMapOpacity"
        );

      this.rotateBorder2 &&
        tl.add(
          gsap.to(this.rotateBorder2.scale, {
            duration: 1,
            delay: 0.5,
            x: 1,
            y: 1,
            z: 1,
            ease: "circ.out",
          }),
          "focusMapOpacity"
        );
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
  // 生成圆点/网格
  createGrid() {
    return new MapGrid(this, {
      gridSize: 50,
      gridDivision: 20,

      shapeSize: 0.5,
      pointSize: 0.1,
      diffuse: true,
      diffuseSpeed: 10,
      gridColor: 1788784,
      pointColor: 1396093,
      shapeColor: 2776970,
      diffuseColor: 3050457,
    });
  }
  createRotateBorder() {
    const size = 12;
    const rotationBorder1 = this.assets.instance.getResource("rotationBorder1");
    const rotationBorder2 = this.assets.instance.getResource("rotationBorder2");
    let gradientShader1 = new GradientShader(this, {
      width: size * 1.178,
      needRotate: !0,
      rotateSpeed: 0.001,
      material: new THREE.MeshBasicMaterial({
        map: rotationBorder1,
        color: 4763647,
        transparent: !0,
        opacity: 0.2,
        side: 2,
        depthWrite: !1,
        blending: 2,
      }),
      position: new THREE.Vector3(0, 0.28, 0),
    });
    gradientShader1.instance.renderOrder = 6;
    gradientShader1.instance.scale.set(0, 0, 0);
    gradientShader1.setParent(this.scene);

    let gradientShader2 = new GradientShader(this, {
      width: size * 1.116,
      needRotate: !0,
      rotateSpeed: -0.004,
      material: new THREE.MeshBasicMaterial({
        map: rotationBorder2,
        color: 4763647,
        transparent: !0,
        opacity: 0.4,
        side: 2,
        depthWrite: !1,
        blending: 2,
      }),
      position: new THREE.Vector3(0, 0.3, 0),
    });
    gradientShader2.instance.renderOrder = 6;
    gradientShader2.instance.scale.set(0, 0, 0);
    gradientShader2.setParent(this.scene);

    this.rotateBorder1 = gradientShader1.instance;
    this.rotateBorder2 = gradientShader2.instance;
  }
  createModel() {
    let mapGroup = new THREE.Group();
    // this.focusMapGroup = new THREE.Group();
    let { fujian, fujianTopLine, fujianBottomLine } = this.createFujian();
    let { quanzhou, quanzhouTop, guangdonLine } = this.createQuanzhou();
    fujian.setParent(mapGroup);
    fujianTopLine.setParent(mapGroup);
    quanzhou.setParent(this.focusMapGroup);
    quanzhouTop.setParent(this.focusMapGroup);
    guangdonLine.setParent(this.focusMapGroup);
    this.focusMapGroup.position.set(0, 0, -0.01);
    this.focusMapGroup.scale.set(1, 1, 0);
    mapGroup.add(this.focusMapGroup);
    mapGroup.rotateX(-Math.PI / 2);
    mapGroup.position.set(0, 0.2, 0);
    this.scene.add(mapGroup);
    this.createBar();
  }
  createFujian() {
    let fujianJsonData = this.assets.instance.getResource("350000");

    const fujianMapInfoData = new MapInfoData(this, {
      data: fujianJsonData,
      center: this.pointCenter,
      merge: false,
      material: new THREE.MeshLambertMaterial({
        color: 1387591,
        transparent: !0,
        opacity: 1,
      }),
      renderOrder: 2,
    });

    const quanzhouMapInfoData = new MapLineInfoData(this, {
      center: this.pointCenter,
      visibelProvince: "广东省",
      data: fujianJsonData,
      material: new THREE.MeshLambertMaterial({ color: 4162253 }),
      renderOrder: 3,
    });
    quanzhouMapInfoData.lineGroup.position.z += 0.01;
    let quanzhouMapInfoData2 = new MapLineInfoData(this, {
      center: this.pointCenter,
      data: fujianJsonData,
      material: new THREE.MeshLambertMaterial({
        color: 4162253,
        transparent: !0,
        opacity: 0.4,
      }),
      renderOrder: 3,
    });
    return (
      (quanzhouMapInfoData2.lineGroup.position.z -= 0.59),
      {
        fujian: fujianMapInfoData,
        fujianTopLine: quanzhouMapInfoData,
        fujianBottomLine: quanzhouMapInfoData2,
      }
    );
  }
  createQuanzhou() {
    let quanzhouData = this.assets.instance.getResource("350500");
    const [a, s] = this.createProvinceMaterial();

    this.focusMapTopMaterial = a;
    this.focusMapSideMaterial = s;
    let e = new MapQuanzhouInfoData(this, {
      center: this.pointCenter,
      position: new THREE.Vector3(0, 0, 0.11),
      data: quanzhouData,
      depth: 0.5,
      topFaceMaterial: a,
      sideMaterial: s,
      renderOrder: 9,
    });
    const defaultMaterial = new THREE.MeshStandardMaterial({
      color: 16777215,
      transparent: !0,
      opacity: 0.5,
    });
    new GradientQuanzhou(defaultMaterial, {
      uColor1: 2780818,
      uColor2: 1058614,
    });
    this.defaultMaterial = defaultMaterial;
    this.defaultLightMaterial = this.defaultMaterial.clone();
    this.defaultLightMaterial.emissive.setHex(725293);
    this.defaultLightMaterial.emissiveIntensity = 3.5;
    let r = new MapInfoData(this, {
      center: this.pointCenter,
      position: new THREE.Vector3(0, 0, 0.72),
      data: quanzhouData,
      material: defaultMaterial,
      renderOrder: 2,
    });
    r.mapGroup.children.map((o) => {
      o.children.map((l) => {
        l.type === "Mesh" && this.eventElement.push(l);
      });
    });
    this.quanzhouLineMaterial = new THREE.LineBasicMaterial({
      color: 16777215,
      opacity: 0,
      transparent: !0,
      fog: !1,
    });
    let c = new MapLineInfoData(this, {
      center: this.pointCenter,
      data: quanzhouData,
      material: this.quanzhouLineMaterial,
      renderOrder: 3,
    });
    return (
      (c.lineGroup.position.z += 0.73),
      { quanzhou: e, quanzhouTop: r, guangdonLine: c }
    );
  }
  createProvinceMaterial() {
    let t = new THREE.MeshLambertMaterial({
      color: 16777215,
      transparent: !0,
      opacity: 0,
      fog: !1,
      side: 2,
    });
    t.onBeforeCompile = (e) => {
      (e.uniforms = {
        ...e.uniforms,
        uColor1: { value: new THREE.Color(2780818) },
        uColor2: { value: new THREE.Color(1058614) },
      }),
        (e.vertexShader = e.vertexShader.replace(
          "void main() {",
          `
        attribute float alpha;
        varying vec3 vPosition;
        varying float vAlpha;
        void main() {
          vAlpha = alpha;
          vPosition = position;
      `
        )),
        (e.fragmentShader = e.fragmentShader.replace(
          "void main() {",
          `
        varying vec3 vPosition;
        varying float vAlpha;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
      
        void main() {
      `
        )),
        (e.fragmentShader = e.fragmentShader.replace(
          "#include <opaque_fragment>",
          `
      #ifdef OPAQUE
      diffuseColor.a = 1.0;
      #endif
      
      // https://github.com/mrdoob/three.js/pull/22425
      #ifdef USE_TRANSMISSION
      diffuseColor.a *= transmissionAlpha + 0.1;
      #endif
      vec3 gradient = mix(uColor1, uColor2, vPosition.x/15.78); // 15.78
      
      outgoingLight = outgoingLight*gradient;
      float topAlpha = 0.5;
      if(vPosition.z>0.3){
        diffuseColor.a *= topAlpha;
      }
      
      gl_FragColor = vec4( outgoingLight, diffuseColor.a  );
      `
        ));
    };
    let side = this.assets.instance.getResource("side");

    side.wrapS = 1000;
    side.wrapT = 1000;
    side.repeat.set(1, 1.5);
    side.offset.y += 0.065;
    let s = new THREE.MeshStandardMaterial({
      color: 16777215,
      map: side,
      fog: !1,
      opacity: 0,
      side: 2,
    });
    return (
      this.time.on("tick", () => {
        side.offset.y += 0.005;
      }),
      (s.onBeforeCompile = (e) => {
        (e.uniforms = {
          ...e.uniforms,
          uColor1: { value: new THREE.Color(2780818) },
          uColor2: { value: new THREE.Color(2780818) },
        }),
          (e.vertexShader = e.vertexShader.replace(
            "void main() {",
            `
        attribute float alpha;
        varying vec3 vPosition;
        varying float vAlpha;
        void main() {
          vAlpha = alpha;
          vPosition = position;
      `
          )),
          (e.fragmentShader = e.fragmentShader.replace(
            "void main() {",
            `
        varying vec3 vPosition;
        varying float vAlpha;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
      
        void main() {
      `
          )),
          (e.fragmentShader = e.fragmentShader.replace(
            "#include <opaque_fragment>",
            `
      #ifdef OPAQUE
      diffuseColor.a = 1.0;
      #endif
      
      // https://github.com/mrdoob/three.js/pull/22425
      #ifdef USE_TRANSMISSION
      diffuseColor.a *= transmissionAlpha + 0.1;
      #endif
      vec3 gradient = mix(uColor1, uColor2, vPosition.z/1.2);
      
      outgoingLight = outgoingLight*gradient;
      
      
      
      gl_FragColor = vec4( outgoingLight, diffuseColor.a  );
      `
          ));
      }),
      [t, s]
    );
  }

  createBar() {}
}
