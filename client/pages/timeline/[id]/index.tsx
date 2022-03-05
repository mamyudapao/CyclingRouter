import { useEffect, useState } from "react";
import TweetDetailComponent from "../../../components/Timeline/TweetDetailComponent";
import { Reply, Tweet } from "../../../types/timelines";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { UserState } from "../../../reducks/user/userSlice";
import Styles from "./index.module.scss";

import axios from "../../../axiosApi";
import TweetCommentComponent from "../../../components/Timeline/TweetCommentComponent";
import Image from "next/image";
import { Button, TextField } from "@mui/material";
import { RemoveCircleOutlineRounded } from "@mui/icons-material";

const IndividualTweet = () => {
  const store = useSelector((state: UserState) => state);
  const router = useRouter();
  const { id } = router.query;
  const [tweet, setTweet] = useState<Tweet | undefined>(undefined);
  const [comment, setComment] = useState("");
  const getTweet = async () => {
    await axios.get<Tweet>(`/tweets/${id}`).then((response) => {
      console.log(response.data);
      setTweet(response.data);
    });
  };

  const postComment = async () => {
    await axios
      .post<Reply>("/reply/", {
        content: comment,
        tweetId: tweet!.id,
        userId: store.user.id,
      })
      .then((response) => {
        console.log(response.data);
        getTweet();
        setComment("");
      });
  };

  const deleteTweet = (tweetId: number) => {
    axios.delete(`tweets/${tweetId}`).then((response) => {
      console.log(response.data);
      router.push("/timeline");
    });
  };

  useEffect(() => {
    if (id !== undefined) {
      getTweet();
    }
  }, [id]);
  return (
    <div className={Styles.wrapper}>
      <div className={Styles.left}>
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
          value={comment}
          onChange={(event) => {
            setComment(event.target.value);
          }}
          className={Styles.postForm}
        />
        <Button
          variant="contained"
          className={Styles.commentButton}
          onClick={() => postComment()}
        >
          コメントする!
        </Button>
      </div>
      <div className={Styles.center}>
        {tweet !== undefined && (
          <div className={Styles.detail}>
            <TweetDetailComponent
              tweet={tweet as Tweet}
              // likeFunction={}
              deleteTweet={deleteTweet}
              userId={store.user.id}
            />
          </div>
        )}
        {tweet !== undefined && (
          <div className={Styles.comments}>
            <TweetCommentComponent replies={tweet.replies} />
          </div>
        )}
      </div>
      <div className={Styles.right}></div>
    </div>
  );
};

export default IndividualTweet;
