import { GormModel } from "./utils";
export interface User extends GormModel {
  username: string;
  email: string;
  biography: string;
  userImage: string;
  location: string;
  birthday: string;
  weight: number;
  height: number;
}

export interface Follow extends GormModel {
  userId: number;
  followId: number;
  user: User;
  follow: User;
}
