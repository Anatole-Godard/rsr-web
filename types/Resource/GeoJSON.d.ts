export type GeoJSON_Point = {
  type: "Feature"; // "Feature"
  geometry: {
    type: "Point"; //"Point";
    coordinates: number[]; //[125.6, 10.1];
  };
  properties: {
    name: string; //"Dinagat Islands";
  };
};
