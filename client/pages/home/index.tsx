import styles from "./index.module.scss";
import { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Card from "@mui/material/Card";
import { Container } from "@mui/material";
import { MarkerPosition } from "./marker";

const home = () => {
  const manageMarkerPositions: MarkerPosition[] = [];

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
      <Container maxWidth="md" className={styles.card}>
        <Card className={styles.container}>
          <div className={styles.map}>
            <LoadScript googleMapsApiKey="AIzaSyBqEkWJHZ0y1BAAKZMxu1gFT3FojQkaG-o">
              <GoogleMap
                options={{ mapId: "cb45e1d3ef965ca5", disableDefaultUI: true }}
                mapContainerStyle={{
                  width: "500px",
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
                {markerPositions.map((position) => {
                  return <Marker position={position} />;
                })}
              </GoogleMap>
            </LoadScript>
          </div>
        </Card>
      </Container>
    </>
  );
};

export default home;
