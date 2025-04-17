import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

const baseQuery = fetchBaseQuery({ 
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // Get the token from state if available
    const token = getState().auth.userInfo?.token;
    
    // If we have a token, add it to the headers
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    return headers;
  },
  credentials: 'include' // This ensures cookies are sent with requests
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Product", "Order", "User", "Category"],
  endpoints: () => ({}),
});
