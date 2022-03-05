import { User } from "./users.d.ts";
export interface Route extends GormModel {
  id: string;
  userId: string;
  user: User;
  image: string;
  direction: string;
  title: string;
  description: string;
}
