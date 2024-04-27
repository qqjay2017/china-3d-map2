import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { MapAnimate } from "./MapAnimate";
import { getGuid } from "./util";
import * as THREE from "three";

// V
export class Label3d {
  scene;
  camera;
  time;
  sizes;
  canvas;
  parent: any;
  css3dRender: CSS3DRenderer;
  constructor({ scene, camera, time, sizes, canvas }: MapAnimate) {
    this.scene = scene;
    this.camera = camera;
    this.time = time;
    this.sizes = sizes;
    this.canvas = canvas;
    this.parent = null;
    let { width, height } = this.sizes;
    const css3dRender = new CSS3DRenderer();
    css3dRender.setSize(width, height);
    css3dRender.domElement.style.position = "absolute";
    css3dRender.domElement.style.left = "0px";
    css3dRender.domElement.style.top = "0px";
    css3dRender.domElement.style.pointerEvents = "none";
    css3dRender.domElement.className = "label3d-" + getGuid();

    this.canvas?.parentNode?.appendChild(css3dRender.domElement);
    console.log(css3dRender.domElement, "css3dRender.domElement");
    this.css3dRender = css3dRender;
    this.time.on("tick", () => {
      this.update();
    });
    this.sizes.on("resize", () => {
      this.resize();
    });
  }
  create(i = "", className = "", a = !1) {
    let tag = document.createElement("div");
    tag.innerHTML = i;
    tag.className = className;
    tag.style.visibility = "hidden";
    tag.style.position = "absolute";
    if (!className) {
      tag.style.padding = "10px";
      tag.style.color = "#fff";
      tag.style.fontSize = "12px";
      tag.style.textAlign = "center";
      // tag.style.background = "rgba(0,0,0,0.6)";
      tag.style.background = "rref";
      tag.style.width = "10000px";
      tag.style.height = "10000px";
      tag.style.borderRadius = "4px";
    }

    let label: any = new CSS3DObject(tag);
    label.init = (name: string, position: THREE.Vector3) => {
      label.element.innerHTML = name;
      label.element.style.visibility = "visible";
      label.position.copy(position);
    };
    label.hide = () => {
      label.element.style.visibility = "hidden";
    };
    label.show = () => {
      label.element.style.visibility = "visible";
    };
    label.setParent = (parent: any) => {
      this.parent = parent;
      parent.add(label);
    };
    label.remove = () => {
      this.parent.remove(label);
    };
    return label;
  }
  setLabelStyle(label: any, size = 0.1, pos = "x", pointerEvents = "none") {
    label.element.style.pointerEvents = pointerEvents;
    label.scale.set(size, size, size);
    label.rotation[pos] = Math.PI / 2;
  }
  update() {
    this.css3dRender.render(this.scene, this.camera.instance);
  }
  destroy() {
    if (this.css3dRender && this.css3dRender.domElement) {
      let domElement = this.css3dRender.domElement;
      domElement.parentNode?.removeChild(domElement);
    }
  }
  resize() {
    let { width: i, height: n } = this.sizes;
    this.css3dRender.setSize(i, n);
  }
}
