import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import Image from "next/Image";
import { Like, Tweet } from "../../types/timelines";
import { parseJSON, getDate, getYear, getMonth } from "date-fns";
import { useEffect, useState } from "react";
import Styles from "./index.module.scss";
import { CardMedia } from "@mui/material";
import Link from "next/link";

type PropsType = {
  tweet: Tweet;
  userId: number;
  likeFunction: (
    tweetId: number,
    userId: number,
    likeIndex: number | null
  ) => void;
};

const TweetComponent = (props: PropsType) => {
  const date = parseJSON(props.tweet.createdAt);
  const timeString = `${getYear(date)}年${getMonth(date)}月${getDate(date)}日`;

  //TODO: 主がlikeしてあった場合は、likesのどれを主がしたやつかを計算する。

  const [likeOrNot, setLikeOrNot] = useState<boolean>(false);
  const [likedIndex, setLikedIndex] = useState<number | null>(null);

  const checkLikeOrNot = (likes: Like[], userId: number) => {
    let check = false;
    let likeIndex: number | null = null;
    likes.forEach((like, index) => {
      if (like.userId === userId) {
        check = true;
        likeIndex = index;
      } else {
        check = false;
      }
    });
    setLikedIndex(likeIndex);
    return check;
  };

  useEffect(() => {
    setLikeOrNot(checkLikeOrNot(props.tweet.likes, props.userId));
    console.log(likedIndex);
  }, [props]);

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar>
            <Image
              src={`https://ddx5fuyp1f5xu.cloudfront.net/${props.tweet.user.userImage}`}
              layout="fill"
            />
          </Avatar>
        }
        title={props.tweet.user.username}
        subheader={timeString}
      />
      {/* <CardMedia
        component="img"
        height="194"
        image="/static/images/cards/paella.jpg"
        alt="Paella dish"
      /> */}
      <div className={Styles.link}>
        <Link href={`/timeline/${props.tweet.id}`}>
          <CardContent>
            <Typography variant="inherit">{props.tweet.content}</Typography>
          </CardContent>
        </Link>
      </div>
      <CardActions>
        <IconButton
          aria-label="add to favorites"
          className={likeOrNot ? Styles.liked : Styles.notLiked}
          sx={{ color: likeOrNot ? "pink" : "" }}
          onClick={() => {
            props.likeFunction(props.tweet.id, props.userId, likedIndex);
          }}
        >
          <FavoriteIcon />

          {props.tweet.likes !== null &&
            props.tweet.likes.length !== 0 &&
            props.tweet.likes.length}
        </IconButton>
        <IconButton aria-label="share">
          <ChatBubbleOutlineIcon />
          {props.tweet.replies !== null &&
            props.tweet.replies.length !== 0 &&
            props.tweet.replies.length}
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default TweetComponent;
