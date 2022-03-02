import { Card } from "@mui/material";
import Styles from "./index.module.scss";
import axios from "../../axisoApi";
import { Route } from "../../types/routes";
import { useEffect, useState } from "react";
import RoutersCards from "../../components/GoogleMap/RouterCards";

const Routers = () => {
  const [routes, setRoutes] = useState<Route[] | null>(null);

  const getRouters = async () => {
    await axios.get<Route[]>("/routes/").then((response) => {
      console.log(response.data);
      setRoutes(response.data);
    });
  };

  useEffect(() => {
    getRouters();
    console.log(routes);
  }, []);

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.leftSide}></div>
      <div className={Styles.center}>
        <Card className={Styles.card}>
          {routes !== null && <RoutersCards routes={routes} />}
        </Card>
      </div>
      <div className={Styles.rightSide}></div>
    </div>
  );
};

export default Routers;
