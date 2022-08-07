import React, { useEffect } from "react";
import styled from "styled-components";

type Props = {
  width: string;
  height: string;
};

const Container = styled.div<Props>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
  padding: 10px;
  /* width: 100vw;
  height: 52.5vw; */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

const Title = styled.h1`
  background: linear-gradient(90deg, rgb(223, 56, 56), rgb(255, 200, 0));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  font-size: 8vw;
`;

function Thumbnail() {
  const queryParams = new URLSearchParams(window.location.search);
  const title = queryParams.get("title");
  const width = queryParams.get("width");
  const height = queryParams.get("height");
  return (
    <Container width={width ?? "1200px"} height={height ?? "630px"}>
      <Title>{title}</Title>
    </Container>
  );
}

export default Thumbnail;
