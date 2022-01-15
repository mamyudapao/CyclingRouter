import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import axios from "../../axisoApi";
import { Router } from "next/router";

type UserObject = {
  email: string;
  username: string;
  password: string;
};

type UserResponse = {
  Biography: string;
  CreatedAt: string;
  Email: string;
  UserImage: string;
  Username: string;
  Location: string;
  Birthday: Date | null;
  refresh_token: string;
  token: string;
};

const persistConfig = {
  key: "root",
  storage,
};

export type UserState = {
  username: string | null;
  email: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  birthday: Date | null;
  location: string | null;
  biography: string | null;
  userImage: string | null;
};

const initialState: UserState = {
  username: null,
  email: null,
  accessToken: null,
  refreshToken: null,
  birthday: null,
  location: null,
  biography: null,
  userImage: null,
};

export const signInAction = createAsyncThunk<UserResponse, UserObject>(
  "users/signInAction",
  async (userObj) => {
    const response = await axios.post<UserResponse>("/users/register", {
      email: userObj.email,
      username: userObj.username,
      password: userObj.password,
    });
    return response.data;
  }
);

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    login: (state) => {
      state.username = "nosiken";
      state.email = "nosiken@gmail.com";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signInAction.fulfilled, (state, action) => {
      console.log(action.payload);
      state.email = action.payload.Email;
      state.username = action.payload.Username;
      state.accessToken = action.payload.token;
      state.refreshToken = action.payload.refresh_token;
    });
  },
});

export const { login } = usersSlice.actions;

export type usersState = ReturnType<typeof usersSlice.reducer>;

export default usersSlice.reducer;
