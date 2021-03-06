import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "../../axiosApi";
import { Route } from "../../types/routes";
import GoogleMapComponent from "../../components/GoogleMap/GoogleMap";
import RouteFormDialog from "../../components/GoogleMap/RouteFormDialog";
import {
  DirectionsServiceOptions,
  GoogleMapOptions,
} from "../../components/GoogleMap/types";
import { Button, Card, Dialog } from "@mui/material";
import Styles from "./index.module.scss";
import DataView from "../../components/DataDisplay/DataView";
import { formatNumber } from "../../utils/numConverter";
import DnD from "../../components/DataDisplay/DnD";
import { useSelector } from "react-redux";
import { UserState } from "../../reducks/user/userSlice";

const libraries = ["places"];
const mapContainerStyle = {
  width: "55vw",
  height: "80vh",
};

const initialRoute: Route = {
  id: "",
  direction: "",
  user: "",
  title: "",
  image: "",
  description: "",
  userId: "",
};

const RouteComponent = (): JSX.Element => {
  const router = useRouter();
  const { id } = router.query;
  const store = useSelector((state: UserState) => state);
  const [mapRef, setMapRef] = useState<google.maps.Map>();
  const [center, setCenter] = useState<google.maps.LatLngLiteral>();
  const [route, setRoute] = useState<Route>(initialRoute);
  const [markers, setMarkers] = useState<google.maps.LatLngLiteral[]>();
  const [origin, setOrigin] = useState<google.maps.LatLngLiteral>();
  const [destination, setDestination] = useState<google.maps.LatLngLiteral>();
  const [directionLoaded, setDirectionLoaded] = useState<boolean>(false);
  const [waypoints, setWaypoints] =
    useState<google.maps.DirectionsWaypoint[]>();
  const [response, setResponse] = useState<google.maps.DirectionsResult>();
  const [distance, setDistance] = useState<number>(0);

  const directionsCallback = (
    result: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === "OK") {
      let sumDistance = 0;
      if (result !== null) {
        result.routes[0].legs.forEach((leg) => {
          if (leg.distance) {
            sumDistance += leg.distance.value;
          }
        });
        //?????????????????????????????????
        sumDistance = Math.round(sumDistance);
        setDistance(sumDistance);
        setResponse(result);
      }
    }
    setDirectionLoaded(true);
  };

  const getDirections = (
    event: any //TODO: any??????
  ) => {
    if (event && markers) {
      setOrigin(markers[0]);
      setDestination(markers[markers.length - 1]);
      const tempWaypoints = markers
        .filter((_, index) => index !== 0 && markers.length - 1)
        .map((position: google.maps.LatLngLiteral, index: number) => {
          return { location: position };
        });
      setWaypoints([...tempWaypoints] as Array<google.maps.DirectionsWaypoint>);
      setDirectionLoaded(false);
    }
  };

  const getPosition = (position: google.maps.MapMouseEvent) => {
    if (!markers || markers.length < 6) {
      if (mapRef?.getCenter()) {
        setCenter(mapRef.getCenter()!.toJSON());
      }
      let json = position.latLng?.toJSON();
      if (json && markers) {
        const newMarkerPositionsArray = [
          ...markers,
          { lat: json.lat, lng: json.lng },
        ] as Array<google.maps.LatLngLiteral>;
        setMarkers(newMarkerPositionsArray);
      }
    }
  };

  const emitSetMakerPositions = (
    newMarkerPositionsArray: google.maps.LatLngLiteral[]
  ) => {
    setMarkers(newMarkerPositionsArray);
  };

  useEffect(() => {
    if (id && !markers) {
      axios
        .get<Route>(`/routes/${id}`, {
          headers: {
            Authorization: "Bearer " + store.accessToken,
          },
        })
        .then((response) => {
          setMarkers(
            JSON.parse(response.data.direction) as google.maps.LatLngLiteral[]
          );
          setRoute(response.data);
        });
    }
    if (markers && !origin) {
      setOrigin(markers[0]);
      setDestination(markers[markers.length - 1]);
      const tempWaypoints = markers
        .filter((_, index) => index !== 0 && markers.length - 1)
        .map((position: google.maps.LatLngLiteral, index: number) => {
          return { location: position };
        });
      setWaypoints([...tempWaypoints] as Array<google.maps.DirectionsWaypoint>);
      setCenter(markers[(markers.length - 1) / 2]);
    }
  });

  const createData = (title: string, description: string) => {
    const direction = JSON.stringify(markers);
    axios
      .put(
        `/routes/${route.id}`,
        {
          title,
          description,
          direction,
          userId: store.user.id,
        },
        {
          headers: {
            Authorization: "Bearer " + store.accessToken,
          },
        }
      )
      .then((response) => {
        router.push(`/${store.user.id}/profile`);
      });
  };

  const googleMapsOptionsObject: GoogleMapOptions = {
    center: center,
    disableDefaultUI: true,
    mapContainerStyle: mapContainerStyle,
    zoom: 15,
    onLoad: (map: google.maps.Map) => {
      setMapRef(map);
    },
    onClick: getPosition,
  };

  const directionsServiceOptionsObject: DirectionsServiceOptions = {
    origin: origin,
    destination: destination,
    directionLoaded: directionLoaded,
    waypoints: waypoints,
    directionsCallback: directionsCallback,
  };

  return (
    <Card className={Styles.card}>
      <div className={Styles.cardContainer}>
        <div>
          <div className={Styles.dataView}>
            <DataView
              distance={formatNumber(distance / 1000, 1)}
              time={formatNumber((distance / 1000 / 25) * 60, 1)}
              calories={formatNumber(
                10 * 65 * (distance / 1000 / 25) * 1.05,
                1
              )}
            />
          </div>
          <GoogleMapComponent
            libraries={libraries as any}
            googleMap={googleMapsOptionsObject}
            directionService={directionsServiceOptionsObject}
            response={response}
            markers={markers}
          />
        </div>
        <div>
          {markers && (
            <DnD
              positions={[...markers]}
              setPositions={emitSetMakerPositions}
            />
          )}
        </div>
      </div>
      {route.userId === store.user.id.toString() && (
        <div>
          <Button variant="contained" onClick={getDirections}>
            ??????????????????
          </Button>
          <RouteFormDialog
            buttonText="???????????????????????????"
            title="??????????????????"
            titleValue={route.title}
            descriptionValue={route.description}
            contentText="????????????????????????????????????????????????"
            sendData={createData}
            onClickText="????????????????????????"
          />
        </div>
      )}
    </Card>
  );
};

export default RouteComponent;
