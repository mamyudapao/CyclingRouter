import Styles from "./index.module.scss";
import TweetComponent from "../../components/Timeline/TweetComponent";
import { useEffect, useState } from "react";
import axios from "../../axisoApi";
import { Like, Tweet } from "../../types/timelines";
import { Avatar, Button, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { UserState } from "../../reducks/user/userSlice";
import Image from "next/image";

const TimeLine = () => {
  const store = useSelector((state: UserState) => state);
  const [tweets, setTweets] = useState<Tweet[] | undefined>(undefined);
  const [content, setContent] = useState<string>("");

  const getTweets = async () => {
    axios.get<Tweet[]>("/tweets/all").then((response) => {
      console.log(response);
      setTweets(response.data);
    });
  };

  const postTweet = async () => {
    await axios
      .post<Tweet>("/tweets/", {
        content: content,
        userId: store.user.id,
      })
      .then((response) => {
        console.log(response.data);
        getTweets();
        setContent("");
      });
  };

  const likeFunction = async (
    tweetId: number,
    userId: number,
    likedIndex: number | null
  ) => {
    const index = tweets!.findIndex((element) => element.id === tweetId);
    console.log(likedIndex);
    if (likedIndex !== null) {
      await axios
        .delete(`likes/${tweets![index].likes[likedIndex].id}`)
        .then((response) => {
          console.log(response.data);
          tweets![index].likes.splice(index, 1);
          setTweets([...tweets!]);
        });
    } else {
      await axios
        .post<Like>("/likes/", {
          userId: userId,
          tweetId: tweetId,
        })
        .then((response) => {
          console.log(response);
          const index = tweets!.findIndex((element) => element.id === tweetId);
          tweets![index].likes.push(response.data);
          setTweets([...tweets!]);
          console.log(tweets);
        });
    }
  };

  useEffect(() => {
    getTweets();
  }, []);

  return (
    <>
      <div className={Styles.wrapper}>
        <div className={Styles.profile}>
          <div className={Styles.avatar}>
            <Image
              src={`https://ddx5fuyp1f5xu.cloudfront.net/${store.user.userImage}`}
              layout="fill"
            />
          </div>
          <TextField
            multiline
            rows={4}
            placeholder="投稿を入力"
            variant="filled"
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
            }}
            className={Styles.postForm}
          />
          <Button
            variant="contained"
            className={Styles.postButton}
            onClick={() => postTweet()}
          >
            投稿する!
          </Button>
        </div>
        <div className={Styles.timeline}>
          {tweets !== undefined &&
            tweets.map((tweet) => {
              return (
                <div className={Styles.tweetCard}>
                  <TweetComponent
                    tweet={tweet}
                    userId={store.user.id}
                    likeFunction={likeFunction}
                  ></TweetComponent>
                </div>
              );
            })}
        </div>
        <div className={Styles.info}>あ</div>
      </div>
    </>
  );
};

export default TimeLine;
