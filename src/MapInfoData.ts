import * as THREE from "three";
import { transfromGeoJSON } from "./util";
import * as d3 from "d3-geo";
import { geoProjectionScale } from "./consts";
import { MapAnimate } from "./MapAnimate";

//ge
export class MapInfoData {
  mapGroup;
  coordinates: any[];
  config;
  constructor({}, e = {}) {
    this.mapGroup = new THREE.Group();
    this.coordinates = [];
    this.config = Object.assign(
      {
        position: new THREE.Vector3(0, 0, 0),
        center: [0, 0] as [number, number],
        data: "",
        renderOrder: 1,
        merge: !1,
        material: new THREE.MeshBasicMaterial({
          color: 1582651,
          transparent: !0,
          opacity: 1,
        }),
      },
      e
    );
    this.mapGroup.position.copy(this.config.position);
    let a = transfromGeoJSON(this.config.data);
    this.create(a);
  }
  geoProjection(e: any) {
    return d3
      .geoMercator()
      .center(this.config.center)
      .scale(geoProjectionScale)
      .translate([0, 0])(e)!;
  }
  create(jsonData: any) {
    let { merge } = this.config;
    let r: THREE.ShapeGeometry[] = [];
    if (
      jsonData.features.forEach((elem: any) => {
        const object3D = new THREE.Object3D();
        let { name, center = [], centroid = [] } = elem.properties;
        this.coordinates.push({ name, center, centroid });
        object3D.userData.name = name;
        elem.geometry.coordinates.forEach((multiPolygon: any) => {
          multiPolygon.forEach((polygon: any[]) => {
            const shape = new THREE.Shape();
            for (let i = 0; i < polygon.length; i++) {
              if (!polygon[i][0] || !polygon[i][1]) return !1;
              console.log(polygon[i], "polygon[i]");
              const [x, y] = this.geoProjection(polygon[i]);

              if (i == 0) {
                shape.moveTo(x, -y);
              }
              shape.lineTo(x, -y);
            }
            console.log(shape, "shape");
            const shapeGeometry = new THREE.ShapeGeometry(shape);
            if (merge) {
              console.log(shapeGeometry, "shapeGeometry");
              r.push(shapeGeometry);
            } else {
              const mesh = new THREE.Mesh(shapeGeometry, this.config.material);
              mesh.renderOrder = this.config.renderOrder;
              mesh.userData.name = name;
              object3D.add(mesh);
            }
          });
        });
        if (!merge) {
          this.mapGroup.add(object3D);
        }
      }) &&
      merge
    ) {
      //TODO
      //   let t = BufferGeometryUtils.mergeGeometries(r);
      //   const n = new y(t, this.config.material);
      //   (n.renderOrder = this.config.renderOrder), this.mapGroup.add(n);
    }
  }
  getCoordinates() {
    return this.coordinates;
  }
  setParent(group: any) {
    group.add(this.mapGroup);
  }
}

// ve
export class MapLineInfoData {
  config;
  lineGroup;
  constructor({}, e = {}) {
    this.config = Object.assign(
      {
        visibelProvince: "",
        center: [0, 0] as [number, number],
        data: "",
        material: new THREE.LineBasicMaterial({ color: 16777215 }),
        type: "LineLoop",
        renderOrder: 1,
      },
      e
    );
    let geoJson = transfromGeoJSON(this.config.data);
    const lineGroup = this.create(geoJson);
    this.lineGroup = lineGroup;
  }
  geoProjection(e: any) {
    return d3
      .geoMercator()
      .center(this.config.center)
      .scale(geoProjectionScale)
      .translate([0, 0])(e)!;
  }
  create(geoJson: any) {
    const { type, visibelProvince } = this.config;
    let features = geoJson.features;
    const group = new THREE.Group();
    for (let i = 0; i < features.length; i++) {
      const feature = features[i];
      feature.properties.name !== visibelProvince &&
        feature.geometry.coordinates.forEach((multiPolygon: any) => {
          const u: any[] = [];
          let s = null;
          type === "Line2"
            ? (multiPolygon[0].forEach((m: any) => {
                const [c, o] = this.geoProjection(m);
                u.push(c, -o, 0);
              }),
              (s = this.createLine2(u)))
            : multiPolygon[0].forEach((m: any) => {
                const [c, o] = this.geoProjection(m);
                u.push(new THREE.Vector3(c, -o, 0));
                s = this.createLine(u);
              }),
            s && group.add(s);
        });
    }
    return group;
  }
  createLine2(e: any) {
    //
    console.log("createLine2");
  }
  createLine(e: any) {
    const { material, renderOrder, type: t } = this.config;
    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setFromPoints(e);
    let lineLoop = new THREE.LineLoop(bufferGeometry, material);
    return (
      (lineLoop.renderOrder = renderOrder),
      (lineLoop.name = "mapLine"),
      lineLoop
    );
  }
  setParent(group: any) {
    group.add(this.lineGroup);
  }
}

// fe
export class MapQuanzhouInfoData {
  mapGroup;
  assets;
  time;
  coordinates: any[];
  config;
  constructor({ assets, time }: MapAnimate, r = {}) {
    this.mapGroup = new THREE.Group();
    this.assets = assets;
    this.time = time;
    this.coordinates = [];
    this.config = Object.assign(
      {
        position: new THREE.Vector3(0, 0, 0),
        center: [0, 0] as [number, number],
        data: "",
        renderOrder: 1,
        topFaceMaterial: new THREE.MeshLambertMaterial({
          color: 1582651,
          transparent: !0,
          opacity: 1,
        }),
        sideMaterial: new THREE.MeshStandardMaterial({
          color: 464171,
          transparent: !0,
          opacity: 1,
        }),
        depth: 0.1,
      },
      r
    );
    this.mapGroup.position.copy(this.config.position);
    let jsonData = transfromGeoJSON(this.config.data);
    this.create(jsonData);
  }
  geoProjection(e: any) {
    return d3
      .geoMercator()
      .center(this.config.center)
      .scale(geoProjectionScale)
      .translate([0, 0])(e)!;
  }
  create(jsonData: any) {
    jsonData.features.forEach((feature: any) => {
      const object3D = new THREE.Object3D();
      let { name, center = [], centroid = [] } = feature.properties;
      this.coordinates.push({ name, center, centroid });
      const extrudeGeometryOptions = {
        depth: this.config.depth,
        bevelEnabled: !0,
        bevelSegments: 1,
        bevelThickness: 0.1,
      };
      let materials = [this.config.topFaceMaterial, this.config.sideMaterial];
      feature.geometry.coordinates.forEach((coordinate: any) => {
        coordinate.forEach((multiPolygon: any) => {
          const shape = new THREE.Shape();
          for (let l = 0; l < multiPolygon.length; l++) {
            if (!multiPolygon[l][0] || !multiPolygon[l][1]) return !1;
            const [b, C] = this.geoProjection(multiPolygon[l]);
            l === 0 && shape.moveTo(b, -C), shape.lineTo(b, -C);
          }
          const extrudeGeometry = new THREE.ExtrudeGeometry(
            shape,
            extrudeGeometryOptions
          );
          const p = new THREE.Mesh(extrudeGeometry, materials);
          object3D.add(p);
        });
      }),
        this.mapGroup.add(object3D);
    });
  }

  getCoordinates() {
    return this.coordinates;
  }
  setParent(e: any) {
    e.add(this.mapGroup);
  }
}
