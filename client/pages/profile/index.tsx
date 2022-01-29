import { Card } from "@mui/material";
import { useState } from "react";
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

//TODO: S3を準備する
//TODO: follow機能をつける

const Profile = () => {
  const store = useSelector((state: UserState) => state);
  const dispatch = useDispatch();
  const [name, setName] = useState<string>(store.username!);
  const [biography, setBiography] = useState<string | null>(store.biography);
  const [location, setLocation] = useState<string | null>(store.location);
  const [birthday, setBirthday] = useState<Date | null>(store.birthday);
  const [image, setImage] = useState<File>();

  const updateUserProfile = (
    newName?: string,
    newBiography?: string | null,
    newLocation?: string | null,
    newBirthday?: Date | null
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
    console.log(name, biography, location, birthday, image);
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
        id: store.id!,
        image: formData,
      })
    );
  };

  const sendNewInfoToAPIServer = () => {
    dispatch(
      updateProfileAction({
        id: store.id!,
        biography: biography,
        birthday: birthday,
        location: location,
        username: name,
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
            }}
            updateProps={updateUserProfile}
            updateImageProps={updateImage}
            update={sendNewInfoToAPIServer}
          />
        </div>
        <div className={Style.profile}>
          <div className={Style.imageBlock}>
            <Image
              src={`https://ddx5fuyp1f5xu.cloudfront.net/${store.userImage}`}
              width="200"
              height="200"
              className={Style.profileImage}
            ></Image>
            <p>Following: 210 Followers: 111</p>
            <p>Location: {store.location}</p>
            <p>Birthday: {store.birthday}</p>
          </div>
          <div className={Style.centerBlock}>
            <div className={Style.profileBlock}>
              <h1>{store.username}</h1>
              <p>{store.biography}</p>
            </div>
            <div>
              <Card className={Style.routerCard}>
                <Image
                  src="/../public/new-google-map.jpg"
                  width="300"
                  height="200"
                ></Image>
                <div className={Style.routeDiscription}>
                  <h3>Titlestar</h3>
                  <p>kyoto ➙ Tokyo ➙ Yokohama</p>
                </div>
              </Card>
              <Card className={Style.routerCard}>
                <Image
                  src="/../public/new-google-map.jpg"
                  width="300"
                  height="200"
                ></Image>
                <div className={Style.routeDiscription}>
                  <h3>Titlestar</h3>
                  <p>kyoto ➙ Tokyo ➙ Yokohama</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default Profile;
