export type GoogleMapOptions = {
  center: google.maps.LatLngLiteral | undefined;
  disableDefaultUI: boolean;
  mapContainerStyle: { width: string; height: string };
  zoom: number;
  onLoad?: (map: google.maps.Map) => void | Promise<void>;
  onClick?: (e: google.maps.MapMouseEvent) => void;
};

export type AutoCompleteOptions = {
  onLoad?: (autocomplete: google.maps.places.Autocomplete) => void;
  onPlaceChanged?: () => void;
  color: string;
};

export type DirectionsServiceOptions = {
  origin: google.maps.LatLngLiteral | undefined;
  destination: google.maps.LatLngLiteral | undefined;
  directionLoaded: boolean;
  waypoints: google.maps.DirectionsWaypoint[] | undefined;
  directionsCallback?: (
    result: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => void;
};
