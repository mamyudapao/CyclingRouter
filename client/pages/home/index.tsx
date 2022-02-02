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
import Dialog from "./Dialog";
import axios from "../../axisoApi";
import { useSelector } from "react-redux";
import { UserState } from "../../reducks/user/userSlice";
import { useRouter } from "next/router";

// TODO: 経路計測時のQueryLIMITについて調査
// TODO: ハードコーディングしたAPIKeyを修正する

//少数第一位で四捨五入
const formatNumber = (num: number, decimalNumber: number): number => {
  //少数第一位で四捨五入
  const returnValue =
    Math.floor(num * Math.pow(10, decimalNumber)) / Math.pow(10, decimalNumber);
  return returnValue;
};

const libraries = ["places"];

const home = () => {
  const store = useSelector((state: UserState) => state);
  const router = useRouter();
  // 経路のリクエスト用
  const [directionLoaded, setDirectionLoaded] = useState<boolean>(false);
  const [destination, setDestination] =
    useState<google.maps.LatLngLiteral | null>(null);
  const [center, setCenter] = useState({
    lat: 35.69575,
    lng: 139.77521,
  } as google.maps.LatLngLiteral | google.maps.LatLng);
  const [origin, setOrigin] = useState<google.maps.LatLngLiteral | null>(null);
  const [distance, setDistance] = useState(0);
  const [waypoints, setWaypoints] =
    useState<google.maps.DirectionsWaypoint[]>();
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
      const tempWaypoints = markerPositions
        .filter((_, index) => index !== 0 && markerPositions.length - 1)
        .map((position: google.maps.LatLngLiteral, index: number) => {
          return { location: position };
        });
      setWaypoints([...tempWaypoints] as Array<google.maps.DirectionsWaypoint>);
      setDirectionLoaded(false);
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
        //小数点以下を切り捨てる
        sumDistance = Math.round(sumDistance);
        setDistance(sumDistance);
        setResponse(result);
      }
    }
    setDirectionLoaded(true);
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
    console.log("aa");
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

  const createData = (title: string, description: string) => {
    const direction = JSON.stringify(markerPositions);
    axios
      .post("/routes/", {
        title,
        description,
        direction,
        user_id: store.id,
      })
      .then((response) => {
        console.log(response);
        router.push("/profile");
      });
  };

  return (
    <>
      <Card className={Styles.card}>
        <div className={Styles.map}>
          <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_googleMapsApiKey!}
            libraries={libraries as any}
          >
            <div className={Styles.topBar}>
              <Autocomplete
                onLoad={(autocomplete) => {
                  setAutocomplete(autocomplete);
                }}
                onPlaceChanged={onPlaceChanged}
              >
                <TextField id={Styles.searchBox} margin="normal" />
              </Autocomplete>
              <Divider
                icon={faBiking}
                bgColor="#ff3d00"
                primary="走行距離"
                secondary={formatNumber(distance / 1000, 1) + "km"}
                width="40%"
              />
              <Divider
                icon={faClock}
                bgColor="#ff3d00"
                primary="時間"
                secondary={formatNumber((distance / 1000 / 25) * 60, 1) + "分"}
                width="40%"
              />
              <Divider
                icon={faBurn}
                bgColor="#ff3d00"
                primary="消費カロリー"
                secondary={
                  formatNumber(10 * 65 * (distance / 1000 / 25) * 1.05, 1) +
                  "kcal"
                }
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
              {origin !== null && destination !== null && !directionLoaded && (
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
                return (
                  <Marker
                    position={position}
                    key={index}
                    label={String(index + 1)}
                  />
                );
              })}
            </GoogleMap>
          </LoadScript>
          <Button variant="contained" onClick={getDirections}>
            経路を求める
          </Button>
          <Dialog sendData={createData}></Dialog>
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
