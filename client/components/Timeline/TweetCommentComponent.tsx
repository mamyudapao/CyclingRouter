import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Reply } from "../../types/timelines";
import { Avatar, CardHeader, IconButton } from "@mui/material";
import Image from "next/image";
import { getDate, getMonth, getYear, parseJSON } from "date-fns";
import { useState } from "react";
import Styles from "./index.module.scss";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Props } from "@fortawesome/react-fontawesome";

type PropsType = {
  replies: Reply[];
};

const CommentCard = (props: Reply) => {
  const date = parseJSON(props.createdAt);
  const timeString = `${getYear(date)}年${getMonth(date)}月${getDate(date)}日`;

  const [likeOrNot, setLikeOrNot] = useState<boolean>(false);
  return (
    <>
      <Card variant="outlined">
        <CardHeader
          avatar={
            <Avatar>
              <Image
                src={`https://ddx5fuyp1f5xu.cloudfront.net/${props.user.userImage}`}
                layout="fill"
              />
            </Avatar>
          }
          title={props.user.username}
          subheader={timeString}
        ></CardHeader>
        <CardContent>
          <Typography variant="inherit">{props.content}</Typography>
        </CardContent>
      </Card>
    </>
  );
};

const CommentCards = (props: PropsType) => {
  const comments = props.replies.map((reply, index) => {
    return <CommentCard {...reply} />;
  });
  return <>{comments}</>;
};

export default CommentCards;
