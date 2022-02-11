import Styles from "./index.module.scss";
import TweetComponent from "../../components/Timeline/TweetComponent";
import { useEffect, useState } from "react";
import axios from "../../axisoApi";
import { Tweet } from "../../types/timelines";
import { Avatar, Button, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { UserState } from "../../reducks/user/userSlice";
import Image from "next/image";

const TimeLine = () => {
  const store = useSelector((state: UserState) => state);
  const [tweets, setTweets] = useState<Tweet[] | undefined>(undefined);
  const [content, setContent] = useState<string>("");

  const postTweet = async () => {
    await axios
      .post<Tweet>("/timelines/", {
        content: content,
        userId: store.user.id,
      })
      .then((response) => {
        console.log(response.data);
        const tempTweets = [response.data, ...tweets!];
        setTweets(tempTweets);
        setContent("");
      });
  };

  useEffect(() => {
    axios.get<Tweet[]>("/timelines/all").then((response) => {
      console.log(response);
      setTweets(response.data);
    });
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
                  <TweetComponent {...tweet}></TweetComponent>
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
