import { User } from "./users";
import { GormModel } from "./utils.d";

export interface Tweet extends GormModel {
  userId: number;
  user: User;
  content: string;
  replies: null;
  likes: null;
}
