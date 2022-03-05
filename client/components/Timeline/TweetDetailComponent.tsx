import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Fade,
  IconButton,
  Paper,
  Popper,
  Typography,
} from "@mui/material";
import { getDate, getMonth, getYear, parseJSON } from "date-fns";
import Image from "next/image";
import { useState } from "react";
import { Like, Tweet } from "../../types/timelines";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Styles from "./index.module.scss";
import PopupState, { bindPopper, bindToggle } from "material-ui-popup-state";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";

type PropsType = {
  tweet: Tweet;
  likeFunction?: (
    tweetId: number,
    userId: number,
    likeIndex: number | null
  ) => void;
  userId: number;
  deleteTweet: (tweedId: number) => void;
};

const TweetDetailComponent = (props: PropsType) => {
  const date = parseJSON(props.tweet.createdAt);
  const timeString = `${getYear(date)}年${getMonth(date)}月${getDate(date)}日`;
  let authorOrNot = props.userId === props.tweet.userId;

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

  return (
    <Card>
      <CardHeader
        avatar={
          <div>
            <Link href={`/${props.tweet.user.id}/profile`}>
              <Avatar>
                <Image
                  src={`https://ddx5fuyp1f5xu.cloudfront.net/${props.tweet.user.userImage}`}
                  layout="fill"
                />
              </Avatar>
            </Link>
          </div>
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
      ></CardHeader>
      <CardContent>
        <Typography variant="inherit">{props.tweet.content}</Typography>
      </CardContent>
      <CardActions>
        <IconButton
          aria-label="add to favorites"
          className={likeOrNot ? Styles.liked : Styles.notLiked}
          sx={{ color: likeOrNot ? "pink" : "" }}
          onClick={() => {
            // props.likeFunction(props.tweet.id, props.userId, likedIndex);
          }}
        >
          <FavoriteIcon />

          {props.tweet.likes !== null &&
            props.tweet.likes.length !== 0 &&
            props.tweet.likes.length}
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default TweetDetailComponent;
