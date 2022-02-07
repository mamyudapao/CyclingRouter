import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "../../axisoApi";
import { Route } from "../../types/routes";
import GoogleMapComponent from "../../components/GoogleMap/GoogleMap";
import {
  DirectionsServiceOptions,
  GoogleMapOptions,
} from "../../components/GoogleMap/types";
import { Card } from "@mui/material";
import Styles from "./index.module.scss";
import DataView from "../../components/DataDisplay/DataView";
import { formatNumber } from "../../utils/numConverter";
import DnD from "../../components/DataDisplay/DnD";

const libraries = ["places"];
const mapContainerStyle = {
  width: "55vw",
  height: "80vh",
};

const RouteComponent = (): JSX.Element => {
  const router = useRouter();
  const { id } = router.query;
  const [mapRef, setMapRef] = useState<google.maps.Map | undefined>(undefined);
  const [center, setCenter] = useState<google.maps.LatLngLiteral | undefined>(
    undefined
  );
  const [markers, setMarkers] = useState<
    google.maps.LatLngLiteral[] | undefined
  >(undefined);
  const [origin, setOrigin] = useState<google.maps.LatLngLiteral | undefined>(
    undefined
  );
  const [destination, setDestination] = useState<
    google.maps.LatLngLiteral | undefined
  >(undefined);
  const [directionLoaded, setDirectionLoaded] = useState<boolean>(false);
  const [waypoints, setWaypoints] = useState<
    google.maps.DirectionsWaypoint[] | undefined
  >(undefined);
  const [response, setResponse] = useState<
    google.maps.DirectionsResult | undefined
  >(undefined);
  const [distance, setDistance] = useState<number>(0);

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

  const emitSetMakerPositions = (
    newMarkerPositionsArray: google.maps.LatLngLiteral[]
  ) => {
    setMarkers(newMarkerPositionsArray);
  };

  useEffect(() => {
    if (id !== undefined && markers === undefined) {
      axios.get<Route>(`/routes/${id}`).then((response) => {
        console.log(response);
        setMarkers(
          JSON.parse(response.data.direction) as google.maps.LatLngLiteral[]
        );
        console.log(markers);
      });
    }
    if (markers !== undefined && origin === undefined) {
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

  const googleMapsOptionsObject: GoogleMapOptions = {
    center: center,
    disableDefaultUI: true,
    mapContainerStyle: mapContainerStyle,
    zoom: 15,
    onLoad: (map: google.maps.Map) => {
      setMapRef(map);
    },
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
      <div>
        <div className={Styles.dataView}>
          <DataView
            distance={formatNumber(distance / 1000, 1)}
            time={formatNumber((distance / 1000 / 25) * 60, 1)}
            calories={formatNumber(10 * 65 * (distance / 1000 / 25) * 1.05, 1)}
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
      {markers != undefined && (
        <DnD positions={[...markers]} setPositions={emitSetMakerPositions} />
      )}
    </Card>
  );
};

export default RouteComponent;
