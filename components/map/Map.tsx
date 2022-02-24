import { LatLngExpression, icon } from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

const ICON = icon({
  iconUrl: "/img/marker.png",
  iconSize: [32, 32],
});

const Map: React.FC<any> = ({
  point,
  className
}: {
  point: LatLngExpression | [number, number];
  className?: string
}) => {
  return (
    <MapContainer
      className={"absolute inset-0 h-full p-10 " + className}
      center={point as LatLngExpression}
      zoom={8}
      //   scrollWheelZoom={false}
    >
      <TileLayer
        attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={point as LatLngExpression} icon={ICON} />
    </MapContainer>
  );
};

export default Map;
