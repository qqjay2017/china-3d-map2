import * as THREE from "three";
export class GradientShader {
  time;
  options: any;
  instance: THREE.Mesh;
  constructor({ time }: { time: any }, t: any = {}) {
    this.time = time;
    this.options = Object.assign(
      {},
      {
        width: 10,
        scale: 1,
        position: new THREE.Vector3(0, 0, 0),
        needRotate: !1,
        rotateSpeed: 0.001,
        material: new THREE.MeshBasicMaterial({
          transparent: !0,
          opacity: 1,
          depthTest: !0,
        }),
      },
      t
    );
    let planeGeometry = new THREE.PlaneGeometry(
      this.options.width,
      this.options.width
    );
    const mesh = new THREE.Mesh(planeGeometry, this.options.material);
    mesh.rotateX(-Math.PI / 2);
    mesh.position.copy(this.options.position);
    mesh.scale.set(this.options.scale, this.options.scale, this.options.scale);
    this.instance = mesh;
  }
  setParent(scene: THREE.Scene) {
    scene.add(this.instance),
      this.time.on("tick", () => {
        this.update();
      });
  }
  update() {
    this.options.needRotate &&
      (this.instance.rotation.z += this.options.rotateSpeed);
  }
}

export class GradientQuanzhou {
  shader: THREE.Shader | null;
  config;
  constructor(meshStandardMaterial: THREE.MeshStandardMaterial, n: any) {
    this.shader = null;
    this.config = Object.assign(
      { uColor1: 2781042, uColor2: 860197, size: 15, dir: "x" },
      n
    );
    this.init(meshStandardMaterial);
  }
  init(meshStandardMaterial: THREE.MeshStandardMaterial) {
    let { uColor1, uColor2, dir, size: l } = this.config;
    const pos: Record<string, number> = { x: 1, y: 2, z: 3 };
    meshStandardMaterial.onBeforeCompile = (shader) => {
      this.shader = shader;
      shader.uniforms = {
        ...shader.uniforms,
        uColor1: { value: new THREE.Color(uColor1) },
        uColor2: { value: new THREE.Color(uColor2) },
        uDir: { value: pos[dir] },
        uSize: { value: l },
      };
      shader.vertexShader = shader.vertexShader.replace(
        "void main() {",
        `
                attribute float alpha;
                varying vec3 vPosition;
                varying float vAlpha;
                void main() {
                  vAlpha = alpha;
                  vPosition = position;
              `
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        "void main() {",
        `
                varying vec3 vPosition;
                varying float vAlpha;
                uniform vec3 uColor1;
                uniform vec3 uColor2;
                uniform float uDir;
                uniform float uSize;
              
                void main() {
              `
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <opaque_fragment>",
        `
              #ifdef OPAQUE
              diffuseColor.a = 1.0;
              #endif
              
              // https://github.com/mrdoob/three.js/pull/22425
              #ifdef USE_TRANSMISSION
              diffuseColor.a *= transmissionAlpha + 0.1;
              #endif
              // vec3 gradient = mix(uColor1, uColor2, vPosition.x / 15.0); 
              vec3 gradient = vec3(0.0,0.0,0.0);
              if(uDir==1.0){
                gradient = mix(uColor1, uColor2, vPosition.x/ uSize); 
              }else if(uDir==2.0){
                gradient = mix(uColor1, uColor2, vPosition.z/ uSize); 
              }else if(uDir==3.0){
                gradient = mix(uColor1, uColor2, vPosition.y/ uSize); 
              }
              outgoingLight = outgoingLight*gradient;
              
              
              gl_FragColor = vec4( outgoingLight, diffuseColor.a  );
              `
      );
    };
  }
}
