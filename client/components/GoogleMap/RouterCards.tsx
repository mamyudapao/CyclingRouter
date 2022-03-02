import Image from "next/image";
import Link from "next/link";
import { Route } from "../../types/routes";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";
import Styles from "./index.module.scss";

type PropsType = {
  route: Route;
};

const RouterCard = (props: PropsType) => {
  return (
    <Card className={Styles.routerCard}>
      <CardHeader
        avatar={
          <div className={Styles.profile}>
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
        title={<h3>{props.route.user.username}</h3>}
      />
      <Link href={`/route/${props.route.id}`}>
        <div className={Styles.link}>
          <CardContent>
            <Typography variant="h4" component="h4">
              {props.route.title}
            </Typography>
            <Typography variant="inherit">{props.route.description}</Typography>
          </CardContent>
          <CardMedia
            src={`https://ddx5fuyp1f5xu.cloudfront.net/${props.route.image}`}
            component="img"
          />
        </div>
      </Link>
    </Card>
  );
};

export default RouterCard;
