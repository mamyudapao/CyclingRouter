import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axisoApi";
import router from "next/router";
import { User } from "../../types/users";

type SignupUserObject = {
  email: string;
  username: string;
  password: string;
};

type LoginUserObject = {
  email: string;
  password: string;
};

type UpdateProfileObject = {
  id: number;
  biography: string;
  birthday: Date | string;
  location: string;
  username: string;
  weight: number;
  height: number;
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
    weight: 0,
    height: 0,
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

export const loginAction = createAsyncThunk<usersState, LoginUserObject>(
  "users/loginAction",
  async (userObj) => {
    const response = await axios.post<UserSignupResponse>("auth/login", {
      email: userObj.email,
      password: userObj.password,
    });
    return response.data;
  }
);

export const updateProfileAction = createAsyncThunk<User, UpdateProfileObject>(
  "users/updateProfileAction",
  async (updateObj) => {
    const response = await axios.put<User>(`users/${updateObj.id}`, {
      biography: updateObj.biography,
      birthday: updateObj.birthday,
      location: updateObj.location,
      username: updateObj.username,
      weight: updateObj.weight,
      height: updateObj.height,
    });
    return response.data;
  }
);

export const updateProfileIconsAction = createAsyncThunk<
  { userImage: string },
  { image: FormData; id: number }
>("users/updateProfileIconsAction", async (updateObj) => {
  console.log(updateObj.image);
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
  reducers: {},
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
    builder.addCase(loginAction.fulfilled, (state, action) => {
      state.user.id = action.payload.user.id;
      state.user.biography = action.payload.user.biography;
      state.user.birthday = action.payload.user.birthday;
      state.user.location = action.payload.user.location;
      state.user.username = action.payload.user.username;
      state.user.userImage = action.payload.user.userImage;
      state.user.weight = action.payload.user.weight;
      state.user.height = action.payload.user.height;
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
      state.user.weight = action.payload.weight;
      state.user.height = action.payload.height;
    });
    builder.addCase(updateProfileIconsAction.fulfilled, (state, action) => {
      console.log(action.payload);
      state.user.userImage = action.payload.userImage;
    });
  },
});

export type usersState = ReturnType<typeof usersSlice.reducer>;

export default usersSlice.reducer;
