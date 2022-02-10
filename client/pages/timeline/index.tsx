import Styles from "./index.module.scss";
import TweetComponent from "../../components/Timeline/TweetComponent";
import { useEffect, useState } from "react";
import axios from "../../axisoApi";
import { Tweet } from "../../types/timelines";

const TimeLine = () => {
  const [tweets, setTweets] = useState<Tweet[] | undefined>(undefined);

  useEffect(() => {
    axios.get<Tweet[]>("/timelines/all").then((response) => {
      console.log(response);
      setTweets(response.data);
    });
  }, []);

  return (
    <>
      <div className={Styles.wrapper}>
        <div className={Styles.profile}>あ</div>
        <div className={Styles.timeline}>
          {tweets !== undefined &&
            tweets.map((tweet) => {
              return <TweetComponent {...tweet}></TweetComponent>;
            })}
        </div>
        <div className={Styles.info}>あ</div>
      </div>
    </>
  );
};

export default TimeLine;
