export const transfromGeoJSON = (worldData: any) => {
  if (typeof worldData === "string") {
    worldData = JSON.parse(worldData);
  }
  let features = worldData.features;
  for (let i = 0; i < features.length; i++) {
    const element = features[i];
    // 将Polygon处理跟MultiPolygon一样的数据结构
    if (element.geometry.type === "Polygon") {
      element.geometry.coordinates = [element.geometry.coordinates];
    }
  }
  return worldData;
};

export function getGuid(len = 10, radix = 62) {
  let chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
  let uuid: string[] = [];
  radix = radix || chars.length;
  for (let i = 0; i < len; i++) {
    uuid[i] = chars[0 | (Math.random() * radix)];
  }
  return uuid.join("");
}
