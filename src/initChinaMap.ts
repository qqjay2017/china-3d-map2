import { MapAnimate } from "./MapAnimate";

import { qzCenter } from "./consts";
export const initChinaMap = () => {
  const mapInstance = new MapAnimate(document.getElementById("canvas")!, {
    geoProjectionCenter: qzCenter,
  });

  return mapInstance;
};
