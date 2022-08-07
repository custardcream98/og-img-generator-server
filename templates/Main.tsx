import React from "react";
import styled from "styled-components";
import IData from "../interfaces/IData";

const Title = styled.h1`
  background: linear-gradient(90deg, rgb(223, 56, 56), rgb(255, 200, 0));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  font-size: 20px;
`;

const Main = (data: IData) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
        width: "1200px",
        height: "630px",
      }}
    >
      <h1
        style={{
          background:
            "linear-gradient(90deg, rgb(223, 56, 56), rgb(255, 200, 0))",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: 800,
          fontSize: "100px",
        }}
      >
        {data.title}
      </h1>
      <h2 style={{ color: "white", fontWeight: 500, fontSize: "50px" }}>
        {data.subtitle}
      </h2>
    </div>
  );
};

export default Main;
