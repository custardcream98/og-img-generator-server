import React from "react";
import IData from "../interfaces/IData";

const Main = (data: IData) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: "black",
        fontFamily:
          '"Noto Sans KR", "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
        width: "1200px",
        height: "630px",
      }}
    >
      <h1
        style={{
          display: "flex",
          background:
            "linear-gradient(90deg, rgb(223, 56, 56), rgb(255, 200, 0))",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          maxWidth: "700px",
          wordBreak: "keep-all",
          textAlign: "center",
          fontWeight: 800,
          fontSize: "90px",
        }}
      >
        {data.title}
      </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "1000px",
          height: "min-content",
        }}
      >
        <p
          style={{
            color: "white",
            fontWeight: 400,
            fontSize: data.subtitle.length < 21 ? "50px" : "40px",
            textAlign: "center",
            overflowWrap: "break-word",
            maxWidth: "inherit",
          }}
        >
          {data.subtitle}
        </p>
      </div>
    </div>
  );
};

export default Main;
