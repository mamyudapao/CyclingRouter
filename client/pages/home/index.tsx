import styles from "./index.module.scss";
import { useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import Card from "@mui/material/Card";
import { Container } from "@mui/material";
import Divider from "../../components/design/Divider";
// iconのインポート
import { faBurn, faBiking, faClock } from "@fortawesome/free-solid-svg-icons";

// TODO: 経路計測時のQueryLIMITについて調査

const home = () => {
  // 経路のリクエスト用
  const [destination, setDestination] = useState(
    null as google.maps.LatLngLiteral
  );
  const [center, setCenter] = useState({
    lat: 35.69575,
    lng: 139.77521,
  } as google.maps.LatLngLiteral); //
  const [origin, setOrigin] = useState(null as google.maps.LatLngLiteral);
  const [distance, setDistance] = useState(null as number);
  const [waypoints, setWaypoints] = useState(
    [] as google.maps.DirectionsWaypoint[]
  );
  const [response, setResponse] = useState(
    null as google.maps.DirectionsResult
  );

  const getDirections = (event: any) => {
    event.preventDefault();
    setOrigin(markerPositions[0]);
    setDestination(markerPositions[markerPositions.length - 1]);
    //setWaypoints用
    markerPositions.pop();
    markerPositions.shift();
    const tempWaypoints = markerPositions.map((position) => {
      return { location: position };
    });
    setWaypoints([...tempWaypoints]);
  };
  const directionsCallback = (
    result: google.maps.DirectionsResult,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === "OK") {
      let sumDistance = 0;
      result.routes[0].legs.forEach((leg) => {
        sumDistance += leg.distance.value;
      });
      setDistance(sumDistance);
      setResponse(result);
    }
  };

  //マーカー関係
  const [markerPositions, setMakerPositions] = useState([]); //TODO: ここの型問題を解消する
  const [mapRef, setMapRef] = useState(null);
  const handleOnLoad = (map: google.maps.Map) => {
    setMapRef(map);
  };
  const getPosition = (position: google.maps.MapMouseEvent) => {
    setCenter(mapRef.getCenter());
    let text = position.latLng.toString();
    text = text.replace("(", "");
    text = text.replace(")", "");
    let split = text.split(" ");
    setMakerPositions([
      ...markerPositions,
      { lat: parseFloat(split[0]), lng: parseFloat(split[1]) },
    ]);
  };

  return (
    <>
      <Container>
        <Card className={styles.card}>
          <div className={styles.map}>
            <LoadScript googleMapsApiKey="AIzaSyBqEkWJHZ0y1BAAKZMxu1gFT3FojQkaG-o">
              <GoogleMap
                options={{ mapId: "cb45e1d3ef965ca5", disableDefaultUI: true }}
                mapContainerStyle={{
                  width: "900px",
                  height: "600px",
                }}
                center={center}
                zoom={8}
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
            <button onClick={getDirections}>経路を求める</button>
          </div>
          <div className="dataDisplay">
            <Divider
              icon={faBiking}
              primary="走行距離"
              secondary={distance / 1000 + "km"}
            />
            <Divider
              icon={faClock}
              primary="時間"
              secondary={(distance / 1000 / 25) * 60 + "分"}
            />
            <Divider
              icon={faBurn}
              primary="消費カロリー"
              secondary={10 * 65 * (distance / 1000 / 25) * 1.05 + "kcal"}
            />
          </div>
        </Card>
      </Container>
    </>
  );
};

export default home;
