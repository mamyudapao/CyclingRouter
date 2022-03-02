import { Card } from "@mui/material";
import Styles from "./index.module.scss";
import axios from "../../axiosApi";
import { Route } from "../../types/routes";
import { useEffect, useState } from "react";
import RoutersCards from "../../components/GoogleMap/RouterCards";

const Routers = () => {
  const [routers, setRoutes] = useState<Route[]>();
  const [leftRouters, setLeftRouters] = useState<Route[]>();
  const [rightRouters, setRightRouters] = useState<Route[]>();

  const getRouters = async () => {
    await axios.get<Route[]>("/routes/").then((response) => {
      setRoutes(response.data);
      setLeftRouters(leftProps(response.data));
      setRightRouters(rightProps(response.data));
    });
  };

  useEffect(() => {
    getRouters();
  }, []);

  const leftProps = (target: Route[]) => {
    return target.filter((element, index) => index % 2 == 0);
  };
  const rightProps = (target: Route[]) => {
    return target.filter((element, index) => index % 2 != 0);
  };

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.leftSide}></div>
      <div className={Styles.center}>
        <Card className={Styles.card}>
          <div>
            {leftRouters &&
              leftRouters.map((router, index) => {
                return <RoutersCards route={router} key={index} />;
              })}
          </div>
          <div>
            {rightRouters &&
              rightRouters.map((router, index) => {
                return <RoutersCards route={router} key={index} />;
              })}
          </div>
        </Card>
      </div>
      <div className={Styles.rightSide}></div>
    </div>
  );
};

export default Routers;
