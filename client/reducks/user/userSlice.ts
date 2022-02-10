import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axisoApi";
import router from "next/router";
import { User } from "../../types/users";

type SignupUserObject = {
  email: string;
  username: string;
  password: string;
};

type UpdateProfileObject = {
  id: number;
  biography: string;
  birthday: Date | string;
  location: string;
  username: string;
};

type UserSignupResponse = {
  // TODO: あくまでサインインのときのやつ
  refreshToken: string;
  accessToken: string;
  user: User;
};

export type UserState = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

const initialState: UserState = {
  accessToken: "",
  refreshToken: "",
  user: {
    id: 0,
    username: "",
    email: "",
    biography: "",
    userImage: "",
    location: "",
    birthday: "",
    createdAt: "",
    updatedAt: "",
  },
};

export const signInAction = createAsyncThunk<
  UserSignupResponse,
  SignupUserObject
>("users/signInAction", async (userObj) => {
  const response = await axios.post<UserSignupResponse>("auth/registration", {
    email: userObj.email,
    username: userObj.username,
    password: userObj.password,
  });
  return response.data;
});

export const updateProfileAction = createAsyncThunk<User, UpdateProfileObject>(
  "users/updateProfileAction",
  async (updateObj) => {
    const response = await axios.put<User>(`users/${updateObj.id}`, {
      biography: updateObj.biography,
      birthday: updateObj.birthday,
      location: updateObj.location,
      username: updateObj.username,
    });
    return response.data;
  }
);

export const updateProfileIconsAction = createAsyncThunk<
  { userImage: string },
  { image: FormData; id: number }
>("users/updateProfileIconsAction", async (updateObj) => {
  const response = await axios.post<{ userImage: string }>(
    `users/${updateObj.id}/image`,
    updateObj.image,
    {
      headers: {
        "content-type": "multipart/form-data",
      },
    }
  );
  return response.data;
});

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    login: (state) => {
      state.user.username = "nosiken";
      state.user.email = "nosiken@gmail.com";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signInAction.fulfilled, (state, action) => {
      console.log(action.payload);
      state.user.id = action.payload.user.id;
      state.user.email = action.payload.user.email;
      state.user.username = action.payload.user.username;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      router.push("/home");
    });
    builder.addCase(updateProfileAction.fulfilled, (state, action) => {
      console.log(action.payload);
      state.user.biography = action.payload.biography;
      state.user.birthday = action.payload.birthday;
      state.user.location = action.payload.location;
      state.user.username = action.payload.username;
    });
    builder.addCase(updateProfileIconsAction.fulfilled, (state, action) => {
      console.log(action.payload);
      state.user.userImage = action.payload.userImage;
    });
  },
});

export const { login } = usersSlice.actions;

export type usersState = ReturnType<typeof usersSlice.reducer>;

export default usersSlice.reducer;
