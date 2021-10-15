import styles from "./index.module.scss";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "300px",
  height: "400px",
};

const center = {
  lat: 35.69575,
  lng: 139.77521,
};

const home = () => {
  return (
    <>
      <LoadScript googleMapsApiKey="AIzaSyBqEkWJHZ0y1BAAKZMxu1gFT3FojQkaG-o">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={1}
        ></GoogleMap>
      </LoadScript>
    </>
  );
};

export default home;
