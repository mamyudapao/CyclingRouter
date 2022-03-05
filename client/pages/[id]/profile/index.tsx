import FollowComponent from "../../../components/Profile/FollowComponent";
import { Button, Card } from "@mui/material";
import { useEffect, useState } from "react";
import Styles from "./profile.module.scss";
import Image from "next/image";
import Head from "next/head";
import axios from "../../../axiosApi";
import {
  UserState,
  updateProfileAction,
  updateProfileIconsAction,
} from "../../../reducks/user/userSlice";
import { useSelector, useDispatch } from "react-redux";
import AlertDialog from "./Dialog";
import { Route } from "../../../types/routes";
import { Tweet } from "../../../types/timelines";
import TweetComponent from "../../../components/Timeline/TweetComponent";
import { getDate, getMonth, getYear } from "date-fns";
import { Follow, User } from "../../../types/users";
import { useRouter } from "next/router";
import { convertImage } from "../../../utils/imageUpload";
import RouterCard from "../../../components/GoogleMap/RouterCards";

//TODO: S3を準備する
//TODO: follow機能をつける

const Profile = (props: any): JSX.Element => {
  const store = useSelector((state: UserState) => state);
  const dispatch = useDispatch();
  const router = useRouter();
  const userId = router.query.id;
  const [name, setName] = useState<string>(store.user.username!);
  const [biography, setBiography] = useState<string>(store.user.biography);
  const [location, setLocation] = useState<string>(store.user.location);
  const [birthday, setBirthday] = useState<string | Date>("");
  const [weight, setWeight] = useState<number>(store.user.weight);
  const [height, setHeight] = useState<number>(store.user.height);
  const [image, setImage] = useState<File>();
  const [routes, setRoutes] = useState<Route[]>();
  const [tweets, setTweets] = useState<Tweet[]>();
  const [displayRoutes, setDisplayRoutes] = useState(true); //falseの時びツイートを表示
  const [followings, setFollowings] = useState<Follow[]>();
  const [followers, setFollowers] = useState<Follow[]>();
  const [user, setUser] = useState<User>();

  //followComponentを制御
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();

  const getRoute = async () => {
    await axios
      .get<Route[]>(`/routes/user/${userId}`, {
        headers: {
          Authorization: "Bearer " + store.accessToken,
        },
      })
      .then((response) => {
        setRoutes(response.data);
      });
  };

  const getMyOwnTweets = async () => {
    await axios
      .get<Tweet[]>(`/tweets/user/${userId}`, {
        headers: {
          Authorization: "Bearer " + store.accessToken,
        },
      })
      .then((response) => {
        setTweets(response.data);
      });
  };

  const deleteTweet = (tweetId: number) => {
    axios
      .delete(`tweets/${tweetId}`, {
        headers: {
          Authorization: "Bearer " + store.accessToken,
        },
      })
      .then((response) => {
        getMyOwnTweets();
      });
  };

  const getUser = async () => {
    await axios
      .get<User>(`users/${userId}`, {
        headers: {
          Authorization: "Bearer " + store.accessToken,
        },
      })
      .then((response) => {
        setUser(response.data);
        setBirthday(response.data.birthday);
        setDate(new Date(response.data.birthday));
      });
  };

  const getFollowings = async () => {
    await axios
      .get<Follow[]>(`follow/followings/${userId}`, {
        headers: {
          Authorization: "Bearer " + store.accessToken,
        },
      })
      .then((response) => {
        setFollowings(response.data);
      });
  };

  const getFollowers = async () => {
    await axios
      .get<Follow[]>(`follow/followers/${userId}`, {
        headers: {
          Authorization: "Bearer " + store.accessToken,
        },
      })
      .then((response) => {
        setFollowers(response.data);
      });
  };

  useEffect(() => {
    if (router.query.id) {
      getRoute();
      getMyOwnTweets();
      getFollowings();
      getFollowers();
      getUser();
    }
  }, [router.query.id, store.user]);
  const updateUserProfile = (
    newName?: string,
    newBiography?: string,
    newLocation?: string,
    newWeight?: number,
    newHeight?: number,
    newBirthday?: Date | string
  ) => {
    if (newName) setName(newName);
    if (newBiography) setBiography(newBiography);
    if (newLocation) setLocation(newLocation);
    if (newBirthday) setBirthday(newBirthday);
    if (newWeight) setWeight(newWeight);
    if (newHeight) setHeight(newHeight);
  };

  const submitImage = () => {
    if (image) {
      const formData = convertImage(image);
      dispatch(
        updateProfileIconsAction({
          id: store.user.id!,
          image: formData,
        })
      );
    }
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
    if (image) {
      submitImage();
    }
  };
  return (
    <>
      <Head>
        <title>{store.user.username}のプロフィール</title>
      </Head>
      <Card className={Styles.card} variant="outlined">
        {userId == store.user.id.toString() && (
          <div className={Styles.changeButton}>
            <AlertDialog
              name={name}
              biography={biography}
              location={location}
              birthday={birthday}
              weight={weight}
              height={height}
              updateProps={updateUserProfile}
              setImage={setImage}
              update={sendNewInfoToAPIServer}
            />
          </div>
        )}
        <div className={Styles.profile}>
          <div className={Styles.imageBlock}>
            <Image
              src={`https://ddx5fuyp1f5xu.cloudfront.net/${user?.userImage}`} //TODO: デフォルト　のURLを設定する
              width="300"
              height="300"
              className={Styles.profileImage}
            ></Image>
            <p>
              {followings && (
                <FollowComponent
                  open={open}
                  title={"Followings"}
                  follows={followings}
                  handleOpenClose={() => {
                    setOpen(!open);
                  }}
                />
              )}
              {followers && (
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
            <p>Location: {user?.location}</p>
            <p>
              Birthday:
              {date && !Number.isNaN(date.getDate())
                ? getYear(date) +
                  "年" +
                  (getMonth(date) + 1) +
                  "月" +
                  getDate(date) +
                  "日"
                : ""}
            </p>
          </div>
          <div className={Styles.centerBlock}>
            <div className={Styles.profileBlock}>
              <h1>{user?.username}</h1>
              <p>{user?.biography}</p>
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
              {routes && displayRoutes && (
                <div className={Styles.routes}>
                  {routes.map((route, index) => {
                    return <RouterCard route={route} key={index}></RouterCard>;
                  })}
                </div>
              )}
              <div className={Styles.tweets}>
                {tweets &&
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
export default Profile;
