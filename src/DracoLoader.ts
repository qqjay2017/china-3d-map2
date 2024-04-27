import * as THREE from "three";
import { MapLoaderInit } from "./MapBase";
import {
  arrow,
  flyLine,
  flyLineFocus,
  guangquan1,
  guangquan2,
  point,
  side,
} from "./imgBase64";
export class MapAssetsLoader {
  onLoadCallback: any;
  instance!: MapLoaderInit;
  constructor(e: any = null) {
    (this.onLoadCallback = e), this.init();
  }
  init() {
    (this.instance = new MapLoaderInit({})),
      this.instance.addLoader(THREE.FileLoader, "FileLoader"),
      this.instance.on("onProgress", (r: any, t: any, n: any) => {
        ((t / n) * 100).toFixed(2) + "";
      }),
      this.instance.on("onLoad", () => {
        this.onLoadCallback && this.onLoadCallback();
      });

    let a = [
      { type: "Texture", name: "huiguang", path: "/huiguang.png" },
      { type: "Texture", name: "watermark", path: "/szxs_logo.png" },
      {
        type: "Texture",
        name: "rotationBorder1",
        path: "/rotationBorder1.png",
      },
      {
        type: "Texture",
        name: "rotationBorder2",
        path: "/rotationBorder2.png",
      },
      { type: "Texture", name: "guangquan1", path: guangquan1 },
      { type: "Texture", name: "guangquan2", path: guangquan2 },
      { type: "Texture", name: "chinaBlurLine", path: "/chinaBlurLine.png" },
      { type: "Texture", name: "ocean", path: "/ocean-blue-bg.png" },
      { type: "Texture", name: "side", path: side },
      { type: "Texture", name: "flyLine", path: flyLine },
      { type: "Texture", name: "flyLineFocus", path: flyLineFocus },
      { type: "Texture", name: "pathLine", path: "/pathLine2.png" },
      { type: "Texture", name: "arrow", path: arrow },
      { type: "Texture", name: "point", path: point },
      { type: "File", name: "zhejiang", path: "/浙江省.json" },
      {
        type: "File",
        name: "china",
        path: "/中华人民共和国.json",
      },
    ];
    this.instance.loadAll(a);
  }
}
