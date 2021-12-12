import Styles from "./index.module.scss";
import { useState, MouseEventHandler } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsService,
  DirectionsRenderer,
  Autocomplete,
} from "@react-google-maps/api";
import { TextField, Card, Button } from "@mui/material";
import Divider from "../../components/design/Divider";
// iconのインポート
import { faBurn, faBiking, faClock } from "@fortawesome/free-solid-svg-icons";
import DnD from "./dnd";
// TODO: 経路計測時のQueryLIMITについて調査
// TODO: ハードコーディングしたAPIKeyを修正する

const home = () => {
  // 経路のリクエスト用
  const [destination, setDestination] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [center, setCenter] = useState({
    lat: 35.69575,
    lng: 139.77521,
  } as google.maps.LatLngLiteral | google.maps.LatLng);
  const [origin, setOrigin] = useState<google.maps.LatLngLiteral | null>(null);
  const [distance, setDistance] = useState(0);
  const [waypoints, setWaypoints] = useState(
    [] as google.maps.DirectionsWaypoint[]
  );
  const [response, setResponse] = useState<google.maps.DirectionsResult | null>(
    null
  );

  // autocomplete用
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const onPlaceChanged = () => {
    const positionJson = autocomplete!.getPlace().geometry?.location?.toJSON();
    if (positionJson !== undefined) {
      setCenter({ lat: positionJson.lat, lng: positionJson.lng });
    }
  };

  const getDirections = (
    event: any //TODO: any解消
  ) => {
    if (event !== undefined) {
      setOrigin(markerPositions[0]);
      setDestination(markerPositions[markerPositions.length - 1]);
      //setWaypoints用
      markerPositions.pop();
      markerPositions.shift();
      const tempWaypoints = markerPositions.map((position) => {
        return { location: position };
      });
      setWaypoints([...tempWaypoints] as Array<google.maps.DirectionsWaypoint>);
    }
  };
  const directionsCallback = (
    result: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === "OK") {
      let sumDistance = 0;
      if (result !== null) {
        result.routes[0].legs.forEach((leg) => {
          if (leg.distance !== undefined) {
            sumDistance += leg.distance.value;
          }
        });
        setDistance(sumDistance);
        setResponse(result);
      }
    }
  };

  //マーカー関係
  const [markerPositions, setMakerPositions] = useState(
    [] as Array<google.maps.LatLngLiteral>
  );
  const emitSetMakerPositions = (
    newMarkerPositionsArray: google.maps.LatLngLiteral[]
  ) => {
    setMakerPositions(newMarkerPositionsArray);
  };
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const handleOnLoad = (map: google.maps.Map) => {
    setMapRef(map);
  };
  const getPosition = (position: google.maps.MapMouseEvent) => {
    if (markerPositions.length < 6) {
      if (mapRef?.getCenter() !== undefined) {
        setCenter(mapRef.getCenter()!);
      }
      let json = position.latLng?.toJSON();
      if (json !== undefined) {
        const newMarkerPositionsArray = [
          ...markerPositions,
          { lat: json.lat, lng: json.lng },
        ] as Array<google.maps.LatLngLiteral>;
        setMakerPositions(newMarkerPositionsArray);
      }
    }
  };

  return (
    <>
      <Card className={Styles.card}>
        <div className={Styles.map}>
          <LoadScript
            googleMapsApiKey="AIzaSyBqEkWJHZ0y1BAAKZMxu1gFT3FojQkaG-o"
            libraries={["places"]}
          >
            <div className={Styles.topBar}>
              <Autocomplete
                onLoad={(autocomplete) => {
                  setAutocomplete(autocomplete);
                }}
                onPlaceChanged={onPlaceChanged}
              >
                <TextField variant="outlined" id={Styles.searchBox} />
              </Autocomplete>
              <Divider
                icon={faBiking}
                bgColor="#ff3d00"
                primary="走行距離"
                secondary={distance / 1000 + "km"}
                width="40%"
              />
              <Divider
                icon={faClock}
                bgColor="#ff3d00"
                primary="時間"
                secondary={(distance / 1000 / 25) * 60 + "分"}
                width="40%"
              />
              <Divider
                icon={faBurn}
                bgColor="#ff3d00"
                primary="消費カロリー"
                secondary={10 * 65 * (distance / 1000 / 25) * 1.05 + "kcal"}
                width="40%"
              />
            </div>

            <GoogleMap
              options={{ mapId: "cb45e1d3ef965ca5", disableDefaultUI: true }}
              mapContainerStyle={{
                width: "55vw",
                height: "80vh",
              }}
              center={center}
              zoom={15}
              onLoad={handleOnLoad}
              onClick={getPosition}
            >
              {origin !== null && destination !== null && (
                <DirectionsService
                  options={{
                    origin: origin,
                    destination: destination,
                    travelMode: "WALKING" as google.maps.TravelMode,
                    waypoints: waypoints,
                  }}
                  callback={directionsCallback}
                />
              )}
              {response !== null && (
                <DirectionsRenderer
                  options={{
                    directions: response,
                  }}
                />
              )}
              {markerPositions.map((position, index) => {
                return <Marker position={position} key={index} />;
              })}
            </GoogleMap>
          </LoadScript>
          <Button variant="contained" onClick={getDirections}>
            経路を求める
          </Button>
        </div>
        <div className={Styles.rightSide}>
          <DnD
            positions={[...markerPositions]}
            setPositions={emitSetMakerPositions}
          />
        </div>
      </Card>
    </>
  );
};

export default home;
