import { MapAnimate } from "./MapAnimate";
import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";

class GridShader {
  time;
  options;
  constructor({
    material: i,
    time: e,
    size: t,
    diffuseColor: r,
    diffuseSpeed: s,
    diffuseWidth: l,
    diffuseDir: f,
  }: any) {
    this.time = e;
    let a = {
      size: 100,
      diffuseSpeed: 15,
      diffuseColor: 9345950,
      diffuseWidth: 10,
      diffuseDir: 1,
    };
    (this.options = Object.assign({}, a, {
      material: i,
      size: t,
      diffuseColor: r,
      diffuseSpeed: s,
      diffuseWidth: l,
      diffuseDir: f,
    })),
      this.init();
  }
  init() {
    let i: any = null,
      {
        material: e,
        size: t,
        diffuseColor: r,
        diffuseSpeed: s,
        diffuseWidth: l,
        diffuseDir: f,
      } = this.options,
      a = t / s;
    (e.onBeforeCompile = (o: any) => {
      (i = o),
        (o.uniforms = {
          ...o.uniforms,
          uTime: { value: 0 },
          uSpeed: { value: s },
          uWidth: { value: l },
          uColor: { value: new THREE.Vector4(r) },
          uDir: { value: f },
        }),
        (o.vertexShader = o.vertexShader.replace(
          "void main() {",
          `
            varying vec3 vPosition;
            void main(){
              vPosition = position;
          `
        )),
        (o.fragmentShader = o.fragmentShader.replace(
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
        )),
        (o.fragmentShader = o.fragmentShader.replace(
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
        ));
    }),
      this.time.on("tick", (o: any) => {
        i &&
          ((i.uniforms.uTime.value += o),
          i.uniforms.uTime.value > a && (i.uniforms.uTime.value = 0));
      });
  }
}

export class MapGrid {
  scene;
  time;
  instance!: THREE.Group | null;
  options;
  constructor({ scene: i, time: e }: MapAnimate, t: any) {
    (this.scene = i), (this.time = e), (this.instance = null);
    let r = {
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
    (this.options = Object.assign({}, r, t)), this.init();
  }
  init() {
    let gridGroup = new THREE.Group();
    gridGroup.name = "Grid";
    let e = this.createGridHelp(),
      t = this.createShapes(),
      r = this.createPoint();
    gridGroup.add(e, t, r),
      gridGroup.position.copy(this.options.position),
      (this.instance = gridGroup),
      this.scene.add(gridGroup);
  }
  createShapes() {
    let {
        gridSize: i,
        gridDivision: e,
        shapeSize: t,
        shapeColor: r,
      } = this.options,
      s = i / e,
      l = i / 2,
      f = new THREE.MeshBasicMaterial({ color: r, side: 2 }),
      a = [];
    for (let p = 0; p < e + 1; p++)
      for (let h = 0; h < e + 1; h++) {
        let d = this.createPlus(t);
        d.translate(-l + p * s, -l + h * s, 0), a.push(d);
      }
    let o = BufferGeometryUtils.mergeGeometries(a),
      u = new THREE.Mesh(o, f);
    return (
      (u.renderOrder = -1), u.rotateX(-Math.PI / 2), (u.position.y += 0.01), u
    );
  }
  createGridHelp() {
    let { gridSize: i, gridDivision: e, gridColor: t } = this.options;
    return new THREE.GridHelper(i, e, t, t);
  }
  createPoint() {
    let {
      gridSize: i,
      pointSize: e,
      pointColor: t,
      pointBlending: r,
      pointLayout: s,
      diffuse: l,
    } = this.options;
    const f = s.row,
      a = s.col,
      o = new Float32Array(f * a * 3);
    for (let d = 0; d < f; d++)
      for (let c = 0; c < a; c++) {
        let w = (d / (f - 1)) * i - i / 2,
          S = 0,
          v = (c / (a - 1)) * i - i / 2,
          m = (d * a + c) * 3;
        (o[m] = w), (o[m + 1] = S), (o[m + 2] = v);
      }
    var u = new THREE.BufferGeometry();
    // https://threejs.org/docs/#api/en/core/BufferGeometry
    u.setAttribute("position", new THREE.BufferAttribute(o, 3));
    let pointsMaterial = new THREE.PointsMaterial({
      size: e,
      sizeAttenuation: !0,
      color: t,
      blending: r,
    });
    const points = new THREE.Points(u, pointsMaterial);
    return l && this.diffuseShader(pointsMaterial), points;
  }
  setPointMode() {}
  diffuseShader(i: THREE.PointsMaterial) {
    let {
      gridSize: e,
      diffuseColor: t,
      diffuseSpeed: r,
      diffuseWidth: s,
    } = this.options;
    return (
      new GridShader({
        material: i,
        time: this.time,
        size: e,
        diffuseColor: t,
        diffuseSpeed: r,
        diffuseWidth: s,
      }),
      !1
    );
  }
  createPlus(i = 50) {
    let e = i / 6 / 3,
      t = i / 3,
      r = [
        new THREE.Vector2(-t, -e),
        new THREE.Vector2(-e, -e),
        new THREE.Vector2(-e, -t),
        new THREE.Vector2(e, -t),
        new THREE.Vector2(e, -t),
        new THREE.Vector2(e, -e),
        new THREE.Vector2(t, -e),
        new THREE.Vector2(t, e),
        new THREE.Vector2(e, e),
        new THREE.Vector2(e, t),
        new THREE.Vector2(-e, t),
        new THREE.Vector2(-e, e),
        new THREE.Vector2(-t, e),
      ],
      s = new THREE.Shape(r);
    return new THREE.ShapeGeometry(s, 24);
  }
}
