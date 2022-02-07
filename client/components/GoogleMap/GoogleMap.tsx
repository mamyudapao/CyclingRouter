import { TextField } from "@mui/material";
import {
  Autocomplete,
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
  LoadScript,
} from "@react-google-maps/api";
import { useEffect } from "react";
import Markers from "./Markers";
import {
  GoogleMapOptions,
  AutoCompleteOptions,
  DirectionsServiceOptions,
} from "./types";

type PropsType = {
  // LoadScript
  libraries: (
    | "drawing"
    | "geometry"
    | "localContext"
    | "places"
    | "visualization"
  )[];
  //GoogleMap
  googleMap: GoogleMapOptions;
  //AutoComplete
  autoComplete?: AutoCompleteOptions;
  //DirectionsService
  directionService?: DirectionsServiceOptions;
  // DirectionsRenderer
  response?: google.maps.DirectionsResult | undefined;
  // Markers
  markers?: google.maps.LatLngLiteral[] | undefined;
};

const GoogleMapComponent = (props: PropsType) => {
  useEffect(() => {
    console.log(props);
  });
  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_googleMapsApiKey!}
      libraries={props.libraries}
    >
      <GoogleMap
        options={{ mapId: "cb45e1d3ef965ca5", disableDefaultUI: true }}
        mapContainerStyle={props.googleMap.mapContainerStyle}
        center={props.googleMap.center}
        zoom={props.googleMap.zoom}
        onLoad={props.googleMap.onLoad}
        onClick={props.googleMap.onClick}
      >
        {props.autoComplete !== undefined && (
          <Autocomplete
            onLoad={props.autoComplete.onLoad}
            onPlaceChanged={props.autoComplete.onPlaceChanged}
          >
            <TextField
              margin="normal"
              style={{
                backgroundColor: props.autoComplete.color,
              }}
            />
          </Autocomplete>
        )}
        {props.directionService !== undefined &&
          !props.directionService.directionLoaded &&
          props.directionService.origin !== undefined && (
            <DirectionsService
              options={{
                origin: props.directionService.origin!,
                destination: props.directionService.destination!,
                travelMode: "WALKING" as google.maps.TravelMode,
                waypoints: props.directionService.waypoints,
              }}
              callback={props.directionService.directionsCallback!}
            />
          )}
        {props.response !== undefined && (
          <DirectionsRenderer
            options={{
              directions: props.response,
            }}
          />
        )}
        {props.markers !== undefined && <Markers markers={props.markers} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
