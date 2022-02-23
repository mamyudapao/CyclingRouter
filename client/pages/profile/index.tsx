import RoutersCards from "./RouterCards";
import { Card } from "@mui/material";
import { useEffect, useState } from "react";
import Style from "./profile.module.scss";
import Image from "next/image";
import axios from "../../axisoApi";
import {
  UserState,
  updateProfileAction,
  updateProfileIconsAction,
} from "../../reducks/user/userSlice";
import { useSelector, useDispatch } from "react-redux";
import AlertDialog from "./Dialog";
import Link from "next/link";
import { Route } from "../../types/routes";

//TODO: S3を準備する
//TODO: follow機能をつける

const Profile = (): JSX.Element => {
  const store = useSelector((state: UserState) => state);
  const dispatch = useDispatch();
  const [name, setName] = useState<string>(store.user.username!);
  const [biography, setBiography] = useState<string>(store.user.biography);
  const [location, setLocation] = useState<string>(store.user.location);
  const [birthday, setBirthday] = useState<string | Date>(store.user.birthday);
  const [weight, setWeight] = useState<number>(store.user.weight);
  const [height, setHeight] = useState<number>(store.user.height);
  const [image, setImage] = useState<File>();
  const [routes, setRoutes] = useState<Route[] | null>(null);

  const getRoute = async () => {
    await axios.get(`/routes/user/${store.user.id}`).then((response) => {
      console.log(response);
      setRoutes(response.data.routes);
    });
  };

  useEffect(() => {
    getRoute();
  }, []);
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
      <Card className={Style.card} variant="outlined">
        <div className={Style.changeButton}>
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
        <div className={Style.profile}>
          <div className={Style.imageBlock}>
            <Image
              src={`https://ddx5fuyp1f5xu.cloudfront.net/${store.user.userImage}`} //TODO: デフォルト　のURLを設定する
              width="200"
              height="200"
              className={Style.profileImage}
            ></Image>
            <p>Following: 210 Followers: 111</p>
            <p>Location: {store.user.location}</p>
            <p>Birthday: {store.user.birthday}</p>
          </div>
          <div className={Style.centerBlock}>
            <div className={Style.profileBlock}>
              <h1>{store.user.username}</h1>
              <p>{store.user.biography}</p>
            </div>
            <div>{routes !== null && <RoutersCards routes={routes} />}</div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default Profile;
