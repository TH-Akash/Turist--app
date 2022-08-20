import React from "react";
import Header from "./Header";

const LayOut = ({ children }) => {
  return (
    <>
      <Header />

      <div>{children}</div>
    </>
  );
};

export default LayOut;
