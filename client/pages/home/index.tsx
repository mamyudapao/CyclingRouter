import Styles from "./index.module.scss";
import { useState, MouseEventHandler } from "react";
import { TextField, Card, Button } from "@mui/material";
import Divider from "../../components/design/Divider";
// iconのインポート
import { faBurn, faBiking, faClock } from "@fortawesome/free-solid-svg-icons";
import DnD from "./dnd";
import Dialog from "./Dialog";
import GoogleMap from "../../components/GoogleMap/GoogleMap";
import {
  GoogleMapOptions,
  AutoCompleteOptions,
  DirectionsServiceOptions,
} from "../../components/GoogleMap/types";
import axios from "../../axisoApi";
import { useSelector } from "react-redux";
import { UserState } from "../../reducks/user/userSlice";
import { useRouter } from "next/router";

//少数第一位で四捨五入
const formatNumber = (num: number, decimalNumber: number): number => {
  //少数第一位で四捨五入
  const returnValue =
    Math.floor(num * Math.pow(10, decimalNumber)) / Math.pow(10, decimalNumber);
  return returnValue;
};

const libraries = ["places"];
const mapContainerStyle = {
  width: "55vw",
  height: "80vh",
};

const home = () => {
  const store = useSelector((state: UserState) => state);
  const router = useRouter();
  // 経路のリクエスト用
  const [directionLoaded, setDirectionLoaded] = useState<boolean>(false);
  const [destination, setDestination] = useState<
    google.maps.LatLngLiteral | undefined
  >(undefined);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: 35.69575,
    lng: 139.77521,
  });
  const [origin, setOrigin] = useState<google.maps.LatLngLiteral | undefined>(
    undefined
  );
  const [distance, setDistance] = useState(0);
  const [waypoints, setWaypoints] =
    useState<google.maps.DirectionsWaypoint[]>();
  const [response, setResponse] = useState<
    google.maps.DirectionsResult | undefined
  >(undefined);

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
      console.log(event);
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
  const [markerPositions, setMakerPositions] = useState<
    google.maps.LatLngLiteral[]
  >([]);
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
        setCenter(mapRef.getCenter()!.toJSON());
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
        userId: store.id,
      })
      .then((response) => {
        console.log(response);
        router.push("/profile");
      });
  };

  const googleMapOptionsObject: GoogleMapOptions = {
    center: center,
    disableDefaultUI: true,
    mapContainerStyle: mapContainerStyle,
    zoom: 15,
    onLoad: handleOnLoad,
    onClick: getPosition,
  };

  const autoCompleteOptionsObject: AutoCompleteOptions = {
    onLoad: (autoComplete) => {
      setAutocomplete(autoComplete);
    },
    onPlaceChanged: onPlaceChanged,
    color: "white",
  };

  const DirectionsServiceOptionsObject: DirectionsServiceOptions = {
    origin: origin,
    destination: destination,
    directionLoaded: directionLoaded,
    waypoints: waypoints,
    directionsCallback: directionsCallback,
  };

  return (
    <>
      <Card className={Styles.card}>
        <div className={Styles.wrapper}>
          <div>
            <div className={Styles.data}>
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
            <div className={Styles.map}>
              <GoogleMap
                libraries={libraries as any}
                googleMap={googleMapOptionsObject}
                autoComplete={autoCompleteOptionsObject}
                directionService={DirectionsServiceOptionsObject}
                response={response}
                markers={markerPositions}
              />
            </div>
          </div>
          <div className={Styles.rightSide}>
            <DnD
              positions={[...markerPositions]}
              setPositions={emitSetMakerPositions}
            />
          </div>
        </div>
        <div id={Styles.buttons}>
          <Button variant="contained" onClick={getDirections}>
            経路を求める
          </Button>
          <Dialog sendData={createData}></Dialog>
        </div>
      </Card>
    </>
  );
};

export default home;
