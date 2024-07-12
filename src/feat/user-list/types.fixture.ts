import { User, UserView } from "./types";

export const UserFixture: User = {
  uuid: "018ea92d-2d30-7cb3-82c8-2c0b665d505b",
  email: "mstone@cook-dunn.net",
  first_name: "Sharon",
  last_name: "King",
  birth_date: "1985-02-24",
  picture_url: "https://picsum.photos/64/64",
  hobbies: [],
  created_at: "2024-04-04T12:54:54.959951Z",
  updated_at: "2024-06-02T03:41:10.146181Z",
};

export const UserListFixture: User[] = [UserFixture];
