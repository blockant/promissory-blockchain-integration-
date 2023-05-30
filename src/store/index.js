import { configureStore } from "@reduxjs/toolkit";
import propertyReducer from "./reducer";

const store = configureStore({
  reducer: {
    property: propertyReducer,
  },
});

export default store;
