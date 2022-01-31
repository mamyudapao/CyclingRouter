import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axisoApi";
import router from "next/router";

type SignupUserObject = {
  email: string;
  username: string;
  password: string;
};

type UpdateProfileObject = {
  id: number;
  biography: string | null;
  birthday: Date | null;
  location: string | null;
  username: string | null;
};

type UserResponse = {
  id: number;
  biography: string;
  createdAt: string;
  email: string;
  userImage: string;
  username: string;
  location: string;
  birthday: Date | null;
  refreshToken: string;
  accessToken: string;
};

export type UserState = {
  id: number | null;
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
  id: null,
  username: null,
  email: null,
  accessToken: null,
  refreshToken: null,
  birthday: null,
  location: null,
  biography: null,
  userImage: null,
};

export const signInAction = createAsyncThunk<UserResponse, SignupUserObject>(
  "users/signInAction",
  async (userObj) => {
    const response = await axios.post<UserResponse>("auth/registration", {
      email: userObj.email,
      username: userObj.username,
      password: userObj.password,
    });
    return response.data;
  }
);

export const updateProfileAction = createAsyncThunk<
  UserResponse,
  UpdateProfileObject
>("users/updateProfileAction", async (updateObj) => {
  const response = await axios.put<UserResponse>(`users/${updateObj.id}`, {
    biography: updateObj.biography,
    birthday: updateObj.birthday,
    location: updateObj.location,
    username: updateObj.username,
  });
  return response.data;
});

export const updateProfileIconsAction = createAsyncThunk<
  UserResponse,
  { image: FormData; id: number }
>("users/updateProfileIconsAction", async (updateObj) => {
  const response = await axios.post<UserResponse>(
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
      state.username = "nosiken";
      state.email = "nosiken@gmail.com";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signInAction.fulfilled, (state, action) => {
      console.log(action.payload);
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      router.push("/home");
    });
    builder.addCase(updateProfileAction.fulfilled, (state, action) => {
      state.biography = action.payload.biography;
      state.birthday = action.payload.birthday;
      state.location = action.payload.location;
      state.username = action.payload.username;
    });
    builder.addCase(updateProfileIconsAction.fulfilled, (state, action) => {
      console.log(action.payload);
      state.userImage = action.payload.userImage;
    });
  },
});

export const { login } = usersSlice.actions;

export type usersState = ReturnType<typeof usersSlice.reducer>;

export default usersSlice.reducer;
