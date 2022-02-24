import { User } from "./users";
import { GormModel } from "./utils.d";

export interface Tweet extends GormModel {
  userId: number;
  user: User;
  content: string;
  image: string;
  replies: Reply[];
  likes: Like[];
}

export interface Like extends GormModel {
  userId: number;
  tweetId: number;
}

export interface Reply extends GormModel {
  tweetId: number;
  userId: number;
  user: User;
  content: string;
}
