import Image from "next/image";
import Link from "next/link";
import { Route } from "../../types/routes";
import { Avatar, Card, CardHeader, CardMedia } from "@mui/material";
import Styles from "./index.module.scss";

type PropsType = {
  route: Route;
};

const RouterCard = (props: PropsType) => {
  return (
    <Card>
      <CardHeader
        avatar={
          <div className={Styles.avatar}>
            <Link href={`/${props.route.user.id}/profile`}>
              <Avatar>
                <Image
                  src={`https://ddx5fuyp1f5xu.cloudfront.net/${props.route.user.userImage}`}
                  layout="fill"
                />
              </Avatar>
            </Link>
          </div>
        }
        title={props.route.user.username}
      />
      <CardMedia component="img" image="" />
    </Card>
  );
};

export default RouterCard;
