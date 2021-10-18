export type GeoJSON_Point = {
  type: string; // "Feature"
  geometry: {
    type: string; //"Point";
    coordinates: number[]; //[125.6, 10.1];
  };
  properties: {
    name: string; //"Dinagat Islands";
  };
};
