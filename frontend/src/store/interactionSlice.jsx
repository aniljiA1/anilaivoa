import { createSlice } from "@reduxjs/toolkit";

const interactionSlice = createSlice({
  name: "interaction",
  initialState: {
    messages: [
      {
        role: "assistant",
        content: "Hello Anil! How can I help you log an HCP interaction today?",
      },
    ],
    loading: false,
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { addMessage, setLoading, setError } = interactionSlice.actions;
export default interactionSlice.reducer;
