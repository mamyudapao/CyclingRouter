export interface Route extends GormModel {
  id: string;
  userId: string;
  direction: string;
  title: string;
  description: string;
}
