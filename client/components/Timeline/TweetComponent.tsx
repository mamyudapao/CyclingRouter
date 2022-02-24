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
import { Button, CardMedia, Fade, Paper, Popover, Popper } from "@mui/material";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import PopupState, { bindPopper, bindToggle } from "material-ui-popup-state";

type PropsType = {
  tweet: Tweet;
  userId: number;
  likeFunction?: (
    tweetId: number,
    userId: number,
    likeIndex: number | null
  ) => void;
  deleteTweet: (tweedId: number) => void;
};

const TweetComponent = (props: PropsType) => {
  const date = parseJSON(props.tweet.createdAt);
  const timeString = `${getYear(date)}年${getMonth(date)}月${getDate(date)}日`;

  //TODO: 主がlikeしてあった場合は、likesのどれを主がしたやつかを計算する。

  const [likeOrNot, setLikeOrNot] = useState<boolean>(false);
  const [likedIndex, setLikedIndex] = useState<number | null>(null);
  let authorOrNot = props.userId === props.tweet.userId;

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
    console.log(typeof authorOrNot);
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
        action={
          authorOrNot && (
            <>
              <PopupState variant="popper" popupId="demo-popup-popper">
                {(popupState) => (
                  <div>
                    <IconButton
                      aria-label="settings"
                      {...bindToggle(popupState)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <Popper {...bindPopper(popupState)} transition>
                      {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={350}>
                          <Paper>
                            <Button
                              onClick={() => {
                                props.deleteTweet(props.tweet.id);
                              }}
                            >
                              本当に削除しますか？
                            </Button>
                          </Paper>
                        </Fade>
                      )}
                    </Popper>
                  </div>
                )}
              </PopupState>
            </>
          )
        }
        subheader={timeString}
      />
      <div className={Styles.link}>
        <Link href={`/timeline/${props.tweet.id}`}>
          <CardContent>
            <Typography variant="inherit">{props.tweet.content}</Typography>
          </CardContent>
        </Link>
      </div>
      {props.tweet.image !== "" && (
        <CardMedia
          component="img"
          id={Styles.cardMedia}
          image={`https://ddx5fuyp1f5xu.cloudfront.net/${props.tweet.image}`}
          alt="Paella dish"
        />
      )}
      <CardActions>
        <IconButton
          aria-label="add to favorites"
          className={likeOrNot ? Styles.liked : Styles.notLiked}
          sx={{ color: likeOrNot ? "pink" : "" }}
          onClick={() => {
            if (props.likeFunction) {
              props.likeFunction(props.tweet.id, props.userId, likedIndex);
            }
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
