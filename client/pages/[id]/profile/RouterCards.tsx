import Image from "next/image";
import Link from "next/link";
import { Route } from "../../../types/routes";
import { Card } from "@mui/material";
import Styles from "./profile.module.scss";

type PropsType = {
  routes: Route[];
};

const RoutersCards = (props: PropsType): JSX.Element => {
  const cards = props.routes.map((route: Route, index) => {
    return (
      <div key={index.toString()}>
        <Card className={Styles.routerCard}>
          <Image
            src={`https://ddx5fuyp1f5xu.cloudfront.net/${route.image}`}
            width="200"
            height="150"
          ></Image>
          <div className={Styles.routeDescription}>
            {route.title.length > 7 && (
              <Link href={`/route/${route.id}`}>
                <a>{route.title.slice(0, 7) + "..."}</a>
              </Link>
            )}
            {route.title.length <= 7 && (
              <Link href={`/route/${route.id}`}>
                <a>{route.title}</a>
              </Link>
            )}
            {route.description.length > 15 && (
              <p>{route.description.slice(0, 15) + "..."}</p>
            )}
            {route.description.length <= 15 && <p>{route.description}</p>}
          </div>
        </Card>
      </div>
    );
  });
  return <>{cards}</>;
};

export default RoutersCards;
