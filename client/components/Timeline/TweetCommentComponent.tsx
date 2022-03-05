import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Reply } from "../../types/timelines";
import { Avatar, CardHeader } from "@mui/material";
import Image from "next/image";
import { getDate, getMonth, getYear, parseJSON } from "date-fns";
import { useState } from "react";
import Styles from "./index.module.scss";
import Link from "next/link";

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
            <div className={Styles.avatar}>
              <Link href={`/${props.user.id}/profile`}>
                <Avatar>
                  <Image
                    src={`https://ddx5fuyp1f5xu.cloudfront.net/${props.user.userImage}`}
                    layout="fill"
                  />
                </Avatar>
              </Link>
            </div>
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
