import Image from "next/image";
import Link from "next/link";
import { Route } from "../../../types/routes";
import { Card } from "@mui/material";
import Styles from "./profile.module.scss";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

type PropsType = {
  routes: Route[];
};

const RoutersCards = (props: PropsType): JSX.Element => {
  const cards = props.routes.map((route: Route, index) => {
    return (
      <div key={index.toString()}>
        <Card className={Styles.routerCard}>
          <Image
            src="/../public/new-google-map.jpg"
            width="200"
            height="150"
          ></Image>
          <div className={Styles.routeDescription}>
            <Link href={`/route/${route.id}`}>
              <a>{route.title}</a>
            </Link>
            <p>{route.description}</p>
          </div>
        </Card>
      </div>
    );
  });
  return <>{cards}</>;
};

export default RoutersCards;
