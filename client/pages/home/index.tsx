import Styles from "./index.module.scss";
import { useState } from "react";
import { Card, Button } from "@mui/material";
import DnD from "../../components/DataDisplay/DnD";
import Dialog from "./Dialog";
import DataView from "../../components/DataDisplay/DataView";
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
import { formatNumber } from "../../utils/numConverter";
import { convertImage } from "../../utils/imageUpload";
import { Route } from "../../types/routes";

//少数第一位で四捨五入

const libraries = ["places"];
const mapContainerStyle = {
  width: "55vw",
  height: "80vh",
};

const home = (): JSX.Element => {
  const store = useSelector((state: UserState) => state);
  const router = useRouter();
  // 経路のリクエスト用
  const [directionLoaded, setDirectionLoaded] = useState<boolean>(false);
  const [destination, setDestination] = useState<google.maps.LatLngLiteral>();
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: 35.69575,
    lng: 139.77521,
  });
  const [origin, setOrigin] = useState<google.maps.LatLngLiteral>();
  const [distance, setDistance] = useState(0);
  const [waypoints, setWaypoints] =
    useState<google.maps.DirectionsWaypoint[]>();
  const [response, setResponse] = useState<google.maps.DirectionsResult>();

  const [image, setImage] = useState<File>();

  // autocomplete用
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete>();

  const onPlaceChanged = () => {
    const positionJson = autocomplete!.getPlace().geometry?.location?.toJSON();
    if (positionJson !== undefined) {
      setCenter({ lat: positionJson.lat, lng: positionJson.lng });
    }
  };

  const getDirections = (
    event: any //TODO: any解消
  ): void => {
    if (event !== undefined) {
      setOrigin(markerPositions[0]);
      setDestination(markerPositions[markerPositions.length - 1]);
      const tempWaypoints = markerPositions
        .filter((_, index) => index !== 0 && markerPositions.length - 1)
        .map((position, index) => {
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

  const createData = async (title: string, description: string) => {
    const direction = JSON.stringify(markerPositions); //TODO: mysqlのtypeを治す
    if (image === undefined) {
      await axios
        .post<Route>("/routes/", {
          title,
          description,
          direction,
          userId: store.user.id,
        })
        .then((response) => {
          console.log(response);
          router.push(`/${store.user.id}/profile`);
        });
    } else {
      let routeId = "0";
      const formData = convertImage(image);
      await axios
        .post<Route>("/routes/", {
          title,
          description,
          direction,
          userId: store.user.id,
          image: image.name,
        })
        .then((response) => {
          routeId = response.data.id;
        });
      if (routeId !== "0") {
        await axios.put(`/routes/${routeId}/image`, formData, {
          headers: {
            "Content-Type": `multipart/form-data`,
          },
        });
      }
    }
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
              <DataView
                distance={formatNumber(distance / 1000, 1)}
                time={formatNumber((distance / 1000 / 25) * 60, 1)}
                calories={formatNumber(
                  10 * 65 * (distance / 1000 / 25) * 1.05,
                  1
                )}
              ></DataView>
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
          <Dialog sendData={createData} setImage={setImage}></Dialog>
        </div>
      </Card>
    </>
  );
};

export default home;
