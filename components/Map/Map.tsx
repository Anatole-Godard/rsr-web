import { LatLngExpression, icon } from "leaflet";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

const ICON = icon({
  iconUrl: "/img/marker.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const Map: React.FC<any> = ({
  point,
  className,
  zoom = 8,
  mapEventHandler,
}: {
  point?: LatLngExpression | [number, number];
  className?: string;
  zoom?: number;
  mapEventHandler?: any;
}) => {
  /**
   * Implements events handler in Leaflet map
   *
   * @returns {JSX.Element}
   */
  const MapEventHandler = () => {
    useMapEvents({
      click: (e) => {
        mapEventHandler.click(e);
        // if (previousSelected !== null) {
        //   previousSelected.setIcon(markerIcon);
        //   setPreviousSelected(null);
        // }
      },
    });
    return <></>;
  };

  return (
    <MapContainer
      className={"absolute inset-0 h-full p-10 " + className}
      center={(point as LatLngExpression) || [46.227638, 2.213749]}
      zoom={zoom}
      //   scrollWheelZoom={false}
    >
      <TileLayer
        attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={point as LatLngExpression} icon={ICON} />
      <MapEventHandler />
    </MapContainer>
  );
};

export default Map;
