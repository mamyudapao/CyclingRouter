import RoutersCards from "./RouterCards";
import FollowComponent from "../../../components/Profile/FollowComponent";
import { Button, Card } from "@mui/material";
import { useEffect, useState } from "react";
import Styles from "./profile.module.scss";
import Image from "next/image";
import axios from "../../../axisoApi";
import {
  UserState,
  updateProfileAction,
  updateProfileIconsAction,
} from "../../../reducks/user/userSlice";
import { useSelector, useDispatch } from "react-redux";
import AlertDialog from "./Dialog";
import Link from "next/link";
import { Route } from "../../../types/routes";
import { Tweet } from "../../../types/timelines";
import TweetComponent from "../../../components/Timeline/TweetComponent";
import { getDate, getMonth, getYear } from "date-fns";
import { Follow } from "../../../types/users";
import { useRouter } from "next/router";

const MyProfileComponent = () => {
  const store = useSelector((state: UserState) => state);
  const dispatch = useDispatch();
  const router = useRouter();
  const userId = router.query.id;
  const [name, setName] = useState<string>(store.user.username!);
  const [biography, setBiography] = useState<string>(store.user.biography);
  const [location, setLocation] = useState<string>(store.user.location);
  const [birthday, setBirthday] = useState<string | Date>(store.user.birthday);
  const [weight, setWeight] = useState<number>(store.user.weight);
  const [height, setHeight] = useState<number>(store.user.height);
  const [image, setImage] = useState<File>();
  const [routes, setRoutes] = useState<Route[] | null>(null);
  const [tweets, setTweets] = useState<Tweet[] | null>(null);
  const [displayRoutes, setDisplayRoutes] = useState(true); //falseの時びツイートを表示
  const [followings, setFollowings] = useState<Follow[] | null>(null);
  const [followers, setFollowers] = useState<Follow[] | null>(null);

  //followComponentを制御
  const [open, setOpen] = useState(false);

  const date = new Date(store.user.birthday);

  const getRoute = async () => {
    await axios.get(`/routes/user/${store.user.id}`).then((response) => {
      console.log(response);
      setRoutes(response.data.routes);
    });
  };

  const getMyOwnTweets = async () => {
    await axios
      .get<Tweet[]>(`/tweets/user/${store.user.id}`)
      .then((response) => {
        console.log(response.data);
        setTweets(response.data);
      });
  };

  const deleteTweet = (tweetId: number) => {
    axios.delete(`tweets/${tweetId}`).then((response) => {
      console.log(response.data);
      getMyOwnTweets();
    });
  };

  const getFollowings = async (userId: number) => {
    await axios
      .get<Follow[]>(`follow/followings/${userId}`)
      .then((response) => {
        console.log(response.data);
        setFollowings(response.data);
      });
  };

  const getFollowers = async (userId: number) => {
    await axios.get<Follow[]>(`follow/followers/${userId}`).then((response) => {
      console.log(response.data);
      setFollowers(response.data);
    });
  };

  useEffect(() => {
    getRoute();
    getMyOwnTweets();
    getFollowings(store.user.id);
    getFollowers(store.user.id);
    console.log(router.query.id);
  }, [router.query.id]);
  const updateUserProfile = (
    newName?: string,
    newBiography?: string,
    newLocation?: string,
    newWeight?: number,
    newHeight?: number,
    newBirthday?: Date | string
  ) => {
    if (newName !== undefined) {
      console.log(newName);
      setName(newName);
      console.log(name);
    }
    if (newBiography !== undefined) {
      setBiography(newBiography);
    }
    if (newLocation !== undefined) {
      setLocation(newLocation);
    }
    if (newBirthday !== undefined) {
      setBirthday(newBirthday);
    }
    if (newWeight !== undefined) {
      setWeight(newWeight);
    }
    if (newHeight !== undefined) {
      setHeight(newHeight);
    }
    console.log(name, biography, location, birthday, image, weight, height);
  };

  const updateImage = (image: File | undefined) => {
    if (typeof image != (undefined && null)) {
      setImage(image);
    }
  };

  const submitImage = () => {
    const formData = new FormData();
    const blob = new Blob([image!], { type: "image" });
    formData.append("image", blob, image?.name);
    dispatch(
      updateProfileIconsAction({
        id: store.user.id!,
        image: formData,
      })
    );
  };

  const sendNewInfoToAPIServer = () => {
    dispatch(
      updateProfileAction({
        id: store.user.id!,
        biography,
        birthday,
        location,
        username: name,
        weight,
        height: height,
      })
    );
    if (image != undefined) {
      submitImage();
    }
  };
  return (
    <>
      <Card className={Styles.card} variant="outlined">
        <div className={Styles.changeButton}>
          <AlertDialog
            {...{
              name,
              biography,
              location,
              birthday,
              image,
              weight,
              height,
            }}
            updateProps={updateUserProfile}
            updateImageProps={updateImage}
            update={sendNewInfoToAPIServer}
          />
        </div>
        <div className={Styles.profile}>
          <div className={Styles.imageBlock}>
            <Image
              src={`https://ddx5fuyp1f5xu.cloudfront.net/${store.user.userImage}`} //TODO: デフォルト　のURLを設定する
              width="300"
              height="300"
              className={Styles.profileImage}
            ></Image>
            <p>
              {followings !== null && (
                <FollowComponent
                  open={open}
                  title={"Followings"}
                  follows={followings}
                  handleOpenClose={() => {
                    setOpen(!open);
                  }}
                />
              )}
              {followers !== null && (
                <FollowComponent
                  open={open}
                  title={"Followers"}
                  follows={followers}
                  handleOpenClose={() => {
                    setOpen(!open);
                  }}
                />
              )}
            </p>
            <p>Location: {store.user.location}</p>
            <p>
              Birthday:
              {getYear(date) +
                "年" +
                (getMonth(date) + 1) +
                "月" +
                getDate(date) +
                "日"}
            </p>
          </div>
          <div className={Styles.centerBlock}>
            <div className={Styles.profileBlock}>
              <h1>{store.user.username}</h1>
              <p>{store.user.biography}</p>
            </div>
            <Button
              id={displayRoutes ? Styles.buttonActive : Styles.buttonInactive}
              onClick={() => {
                setDisplayRoutes(true);
              }}
            >
              ルート
            </Button>
            <Button
              id={displayRoutes ? Styles.buttonInactive : Styles.buttonActive}
              onClick={() => {
                setDisplayRoutes(false);
              }}
            >
              ツイート
            </Button>
            <div>
              {routes !== null && displayRoutes && (
                <RoutersCards routes={routes} />
              )}
              <div className={Styles.tweets}>
                {tweets !== null &&
                  !displayRoutes &&
                  tweets.map((tweet, index) => {
                    return (
                      <TweetComponent
                        key={index}
                        tweet={tweet}
                        userId={store.user.id}
                        deleteTweet={deleteTweet}
                      />
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default MyProfileComponent;
