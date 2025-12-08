import { createSlice, PayloadAction } from "@reduxjs/toolkit";
/* eslint-disable @typescript-eslint/no-explicit-any */
type AccountState = {
  currentUser: any | null;
};

const initialState: AccountState = {
  currentUser: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<any | null>) => {
      state.currentUser = action.payload;
    },
  },
});

export const { setCurrentUser } = accountSlice.actions;
export default accountSlice.reducer;
