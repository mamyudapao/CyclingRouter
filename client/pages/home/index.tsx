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
import { MarkerPosition } from "./marker";
import { MouseEventHandler } from "react-transition-group/node_modules/@types/react";
// iconのインポート
import { faBurn, faBiking, faClock } from "@fortawesome/free-solid-svg-icons";

const home = () => {
  // 経路のリクエスト用
  const [destination, setDestination] = useState(null); //TODO: dispatch <any>を解消する
  const [origin, setOrigin] = useState(null);
  const [distance, setDistance] = useState(null);
  const [waypoints, setWaypoints] = useState(
    [] as google.maps.DirectionsWaypoint[]
  );
  const [response, setResponse] = useState(null);
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
  const directionsCallback = (response) => {
    if (response?.status === "OK") {
      console.log(response.routes[0].legs);
      let sumDistance = 0;
      response.routes[0].legs.forEach((leg) => {
        sumDistance += leg.distance.value;
      });
      setDistance(sumDistance);
      setResponse(response);
    }
  };

  //マーカー関係
  const [markerPositions, setMakerPositions] = useState([]);
  const [mapRef, setMapRef] = useState(null);
  const handleOnLoad = (map: google.maps.Map) => {
    setMapRef(map);
  };
  const getPosition = (position: google.maps.MapMouseEvent) => {
    let text = position.latLng.toString();
    text = text.replace("(", "");
    text = text.replace(")", "");
    let split = text.split(" ");
    setMakerPositions([
      ...markerPositions,
      { lat: parseFloat(split[0]), lng: parseFloat(split[1]) },
    ]);
    console.log(markerPositions);
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
                center={{
                  lat: 35.69575,
                  lng: 139.77521,
                }}
                zoom={8}
                onLoad={handleOnLoad}
                onClick={getPosition}
              >
                {origin !== "" && destination !== "" && (
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
              secondary={10 * 65 * (distance / 1000 / 25) * 1.05}
            />
          </div>
        </Card>
      </Container>
    </>
  );
};

export default home;
