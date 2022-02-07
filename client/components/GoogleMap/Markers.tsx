import { Marker } from "@react-google-maps/api";

type PropsType = {
  markers: Array<google.maps.LatLngLiteral>;
};

const Markers = (props: PropsType) => {
  const markerPositions = props.markers.map((position, index) => {
    return <Marker position={position} key={index} label={String(index + 1)} />;
  });
  return <>{markerPositions}</>;
};

export default Markers;
