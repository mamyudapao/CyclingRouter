import Styles from "./index.module.scss";
import { useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsService,
  DirectionsRenderer,
  Autocomplete,
} from "@react-google-maps/api";
import { TextField, Card } from "@mui/material";
import Divider from "../../components/design/Divider";
// iconのインポート
import { faBurn, faBiking, faClock } from "@fortawesome/free-solid-svg-icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DnD from "./dnd";
// TODO: 経路計測時のQueryLIMITについて調査

const home = () => {
  // 経路のリクエスト用
  const [destination, setDestination] = useState(
    null as google.maps.LatLngLiteral
  );
  const [center, setCenter] = useState({
    lat: 35.69575,
    lng: 139.77521,
  } as google.maps.LatLngLiteral);
  const [origin, setOrigin] = useState(null as google.maps.LatLngLiteral);
  const [distance, setDistance] = useState(null as number);
  const [waypoints, setWaypoints] = useState(
    [] as google.maps.DirectionsWaypoint[]
  );
  const [response, setResponse] = useState(
    null as google.maps.DirectionsResult
  );

  // autocomplete用
  const [autocomplete, setAutocomplete] = useState(null);
  const onPlaceChanged = () => {
    const positionJson = autocomplete.getPlace().geometry?.location.toJSON();
    if (positionJson !== undefined) {
      setCenter({ lat: positionJson.lat, lng: positionJson.lng });
    }
  };

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
    setWaypoints([...tempWaypoints] as Array<google.maps.DirectionsWaypoint>);
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

  const autoCompleteOnChangePlaced = (event) => {
    console.log(event);
  };

  //マーカー関係
  const [markerPositions, setMakerPositions] = useState(
    [] as Array<google.maps.LatLngLiteral>
  ); //TODO: ここの型問題を解消する
  const [mapRef, setMapRef] = useState(null);
  const handleOnLoad = (map: google.maps.Map) => {
    setMapRef(map);
  };
  const getPosition = (position: google.maps.MapMouseEvent) => {
    setCenter(mapRef.getCenter());
    console.log(position.latLng);
    let json = position.latLng.toJSON();
    console.log(json);
    setMakerPositions([...markerPositions, { lat: json.lat, lng: json.lng }]);
  };

  return (
    <>
      <Card className={Styles.card}>
        <div className={Styles.map}>
          <LoadScript
            googleMapsApiKey="AIzaSyBqEkWJHZ0y1BAAKZMxu1gFT3FojQkaG-o"
            libraries={["places"]}
          >
            <Autocomplete
              onLoad={(autocomplete) => {
                console.log(setAutocomplete(autocomplete));
              }}
              onPlaceChanged={onPlaceChanged}
            >
              <TextField variant="outlined" id={Styles.searchBox} />
            </Autocomplete>
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
          <button onClick={getDirections}>経路を求める</button>
        </div>
        <DnD></DnD>
        <div className={Styles.dataDisplay}>
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
    </>
  );
};

export default home;
