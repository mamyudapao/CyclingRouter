import { Card } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompass } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import Style from "./profile.module.scss";
import Image from "next/image";
import axios from "../../axisoApi";
import { UserState } from "../../reducks/user/userSlice";
import { useSelector } from "react-redux";

type UserInfo = {
  userName: string;
  UserImage: string | null;
  ID: number;
  createAt: string;
  biography: string | null;
  email: string;
};
//todo list
//TODO: S3を準備する
//TODO: follow機能をつける
//TODO: 誕生日機能をつける

const Profile = () => {
  const store = useSelector((state: UserState) => state);
  return (
    <>
      <Card className={Style.card} variant="outlined">
        <div className={Style.profile}>
          <div className={Style.imageBlock}>
            <Image
              src="/../public/9784299022110.jpg"
              width="200"
              height="200"
              className={Style.profileImage}
            ></Image>
            <p>Following: 210 Followers: 111</p>
            <p>Location: 千葉</p>
            <p>Birthday: 1998/10/15</p>
          </div>
          <div className={Style.centerBlock}>
            <h1>{store.username}</h1>
            <p>{store.biography}</p>
          </div>
        </div>
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
      </Card>
    </>
  );
};

export default Profile;
