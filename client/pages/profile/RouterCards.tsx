import Image from "next/image";
import Link from "next/link";
import { Route } from "../../types/routes";
import { Card } from "@mui/material";
import Styles from "./profile.module.scss";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

type PropsType = {
  routes: Route[];
};

const RoutersCards = (props: PropsType) => {
  const cards = props.routes.map((route: Route) => {
    return (
      <Card className={Styles.routerCard}>
        <Image
          src="/../public/new-google-map.jpg"
          width="300"
          height="200"
        ></Image>
        <Link href={`/route/${route.id}`}>
          <a>{route.title}</a>
        </Link>
        <p>{route.description}</p>
      </Card>
    );
  });
  return <>{cards}</>;
};

export default RoutersCards;
