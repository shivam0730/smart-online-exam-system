import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import api from "../services/api";

const savedUser = JSON.parse(
  localStorage.getItem("user") || "null"
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/auth/login",
        credentials
      );

      const { token, user } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      return {
        token,
        user,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to login. Please try again."
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: savedUser,
    token: localStorage.getItem("token"),
    isLoading: false,
    error: null,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(
        loginUser.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      )

      .addCase(
        loginUser.rejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  logout,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;