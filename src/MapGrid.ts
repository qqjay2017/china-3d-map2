import { MapAnimate } from "./MapAnimate";
import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";

class GridShader {
  time;
  options;
  constructor({
    material,
    time,
    size,
    diffuseColor,
    diffuseSpeed,
    diffuseWidth,
    diffuseDir,
  }: any) {
    this.time = time;
    let a = {
      size: 100,
      diffuseSpeed: 15,
      diffuseColor: 9345950,
      diffuseWidth: 10,
      diffuseDir: 1,
    };
    this.options = Object.assign({}, a, {
      material,
      size,
      diffuseColor,
      diffuseSpeed,
      diffuseWidth,
      diffuseDir,
    });

    this.init();
  }
  init() {
    let i: any = null;
    const {
      material,
      size,
      diffuseColor,
      diffuseSpeed,
      diffuseWidth,
      diffuseDir,
    } = this.options;
    const sideSpeedRadio = size / diffuseSpeed;
    material.onBeforeCompile = (o: any) => {
      i = o;
      o.uniforms = {
        ...o.uniforms,
        uTime: { value: 0 },
        uSpeed: { value: diffuseSpeed },
        uWidth: { value: diffuseWidth },
        uColor: { value: new THREE.Color(diffuseColor) },
        uDir: { value: diffuseDir },
      };

      o.vertexShader = o.vertexShader.replace(
        "void main() {",
        `
            varying vec3 vPosition;
            void main(){
              vPosition = position;
          `
      );
      o.fragmentShader = o.fragmentShader.replace(
        "void main() {",
        `
            uniform float uTime;
            uniform float uSpeed;
            uniform float uWidth;
            uniform vec3 uColor;
            uniform float uDir;
            varying vec3 vPosition;
            
            void main(){
          `
      );
      o.fragmentShader = o.fragmentShader.replace(
        "#include <opaque_fragment>",
        `
            #ifdef OPAQUE
            diffuseColor.a = 1.0;
            #endif
            
            #ifdef USE_TRANSMISSION
            diffuseColor.a *= material.transmissionAlpha;
            #endif
            
            float r = uTime * uSpeed;
            //光环宽度
            float w = 0.0; 
            if(w>uWidth){
              w = uWidth;
            }else{
              w = uTime * 5.0;
            }
            //几何中心点
            vec2 center = vec2(0.0, 0.0); 
            // 距离圆心的距离

            float rDistance = distance(vPosition.xz, center);
            if(uDir==2.0){
              rDistance = distance(vPosition.xy, center);
            }
            if(rDistance > r && rDistance < r + 2.0 * w) {
              float per = 0.0;
              if(rDistance < r + w) {
                per = (rDistance - r) / w;
                outgoingLight = mix(outgoingLight, uColor, per);
              } else {
                per = (rDistance - r - w) / w;
                outgoingLight = mix(uColor, outgoingLight, per);
              }
              gl_FragColor = vec4(outgoingLight, diffuseColor.a);
            } else {
              gl_FragColor = vec4(outgoingLight, 0.0);
            }
          `
      );
    };
    this.time.on("tick", (o: any) => {
      if (i) {
        i.uniforms.uTime.value += o;
        if (i.uniforms.uTime.value > sideSpeedRadio) {
          i.uniforms.uTime.value = 0;
        }
      }
    });
  }
}

export class MapGrid {
  scene;
  time;
  instance!: THREE.Group | null;
  options;
  constructor({ scene, time }: MapAnimate, t: any) {
    this.scene = scene;
    this.time = time;
    this.instance = null;
    let defaultOptions = {
      position: new THREE.Vector3(0, 0, 0),
      gridSize: 100,
      gridDivision: 20,
      gridColor: 2635578,
      shapeSize: 1,
      shapeColor: 9345950,
      pointSize: 0.2,
      pointColor: 2635578,
      pointLayout: { row: 200, col: 200 },
      pointBlending: 1,
      diffuse: !1,
      diffuseSpeed: 15,
      diffuseColor: 9345950,
      diffuseWidth: 10,
    };
    // 合并option
    this.options = Object.assign({}, defaultOptions, t);

    this.init();
  }
  init() {
    let gridGroup = new THREE.Group();
    gridGroup.name = "Grid";
    let gridHelp = this.createGridHelp();
    let shapes = this.createShapes();
    let point = this.createPoint();

    gridGroup.add(gridHelp, shapes, point);
    gridGroup.position.copy(this.options.position);
    this.instance = gridGroup;
    this.scene.add(gridGroup);
  }
  createShapes() {
    let { gridSize, gridDivision, shapeSize, shapeColor } = this.options;
    const s = gridSize / gridDivision;
    const l = gridSize / 2;
    const meshBasicMaterial = new THREE.MeshBasicMaterial({
      color: shapeColor,
      side: 2,
    });
    let a = [];
    for (let p = 0; p < gridDivision + 1; p++)
      for (let h = 0; h < gridDivision + 1; h++) {
        let d = this.createPlus(shapeSize);
        d.translate(-l + p * s, -l + h * s, 0);
        a.push(d);
      }

    const bufferGeometry = BufferGeometryUtils.mergeGeometries(a);
    const mesh = new THREE.Mesh(bufferGeometry, meshBasicMaterial);
    mesh.renderOrder = -1;
    mesh.rotateX(-Math.PI / 2);
    mesh.position.y += 0.01;
    return mesh;
  }
  createGridHelp() {
    let { gridSize, gridDivision, gridColor } = this.options;
    return new THREE.GridHelper(gridSize, gridDivision, gridColor, gridColor);
  }
  createPoint() {
    let {
      gridSize,
      pointSize,
      pointColor,
      pointBlending,
      pointLayout,
      diffuse,
    } = this.options;
    const row = pointLayout.row;
    const col = pointLayout.col;
    const vertices = new Float32Array(row * col * 3);

    for (let d = 0; d < row; d++)
      for (let c = 0; c < col; c++) {
        let x = (d / (row - 1)) * gridSize - gridSize / 2;
        let y = 0;
        let z = (c / (col - 1)) * gridSize - gridSize / 2;
        let m = (d * col + c) * 3;

        vertices[m] = x;
        vertices[m + 1] = y;
        vertices[m + 2] = z;
      }
    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    let pointsMaterial = new THREE.PointsMaterial({
      size: pointSize,
      sizeAttenuation: !0,
      color: pointColor,
      blending: pointBlending,
    });
    const points = new THREE.Points(geometry, pointsMaterial);
    return diffuse && this.diffuseShader(pointsMaterial), points;
  }
  setPointMode() {}
  diffuseShader(pointsMaterial: THREE.PointsMaterial) {
    let { gridSize, diffuseColor, diffuseSpeed, diffuseWidth } = this.options;
    return (
      new GridShader({
        material: pointsMaterial,
        time: this.time,
        size: gridSize,
        diffuseColor: diffuseColor,
        diffuseSpeed: diffuseSpeed,
        diffuseWidth: diffuseWidth,
      }),
      !1
    );
  }
  createPlus(size = 50) {
    let x = size / 6 / 3,
      y = size / 3;
    const points = [
      new THREE.Vector2(-y, -x),
      new THREE.Vector2(-x, -x),
      new THREE.Vector2(-x, -y),
      new THREE.Vector2(x, -y),
      new THREE.Vector2(x, -y),
      new THREE.Vector2(x, -x),
      new THREE.Vector2(y, -x),
      new THREE.Vector2(y, x),
      new THREE.Vector2(x, x),
      new THREE.Vector2(x, y),
      new THREE.Vector2(-x, y),
      new THREE.Vector2(-x, x),
      new THREE.Vector2(-y, x),
    ];
    const shapes = new THREE.Shape(points);
    return new THREE.ShapeGeometry(shapes, 24);
  }
}
