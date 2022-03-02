import Styles from "./index.module.scss";
import TweetComponent from "../../components/Timeline/TweetComponent";
import { useEffect, useState } from "react";
import axios from "../../axiosApi";
import { Like, Tweet } from "../../types/timelines";
import { Avatar, Button, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { UserState } from "../../reducks/user/userSlice";
import Image from "next/image";
import UploadButton from "../../components/common/ImageUpload";
import { convertImage } from "../../utils/imageUpload";

const TimeLine = (props: any) => {
  const store = useSelector((state: UserState) => state);
  const [tweets, setTweets] = useState<Tweet[]>();
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File>();

  const getTweets = async () => {
    axios.get<Tweet[]>("/tweets/all").then((response) => {
      console.log(response);
      setTweets(response.data);
    });
  };

  const postTweet = async () => {
    let id: number | undefined = undefined;
    if (content.length !== 0) {
      await axios
        .post<Tweet>("/tweets/", {
          content: content,
          userId: store.user.id,
          image: image?.name,
        })
        .then((response) => {
          console.log(response.data);
          id = response.data.id;
          setContent("");
        });
      if (image) {
        const formData = convertImage(image);
        await axios
          .post(`/tweets/${id}/imageUpload`, formData, {
            headers: {
              "content-type": "multipart/form-data",
            },
          })
          .then(() => {
            setImage(undefined);
          });
      }
      getTweets();
    }
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

  const deleteTweet = (tweetId: number) => {
    axios.delete(`tweets/${tweetId}`).then((response) => {
      console.log(response.data);
      getTweets();
    });
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
          <div className={Styles.postButton}>
            <UploadButton message="画像" setImage={setImage} />
            <Button variant="contained" onClick={() => postTweet()}>
              投稿
            </Button>
          </div>
        </div>
        <div className={Styles.timeline}>
          {tweets &&
            tweets.map((tweet, index) => {
              return (
                <div className={Styles.tweetCard}>
                  <TweetComponent
                    key={index}
                    tweet={tweet}
                    userId={store.user.id}
                    likeFunction={likeFunction}
                    deleteTweet={deleteTweet}
                  ></TweetComponent>
                </div>
              );
            })}
        </div>
        <div className={Styles.info}></div>
      </div>
    </>
  );
};

export default TimeLine;
