import { readFileSync } from "fs";

const medium = readFileSync(
  `${__dirname}/../../public/fonts/NotoSansKR-Medium.otf`
).toString("base64");
const black = readFileSync(
  `${__dirname}/../../public/fonts/NotoSansKR-Black.otf`
).toString("base64");

export default `
    @font-face {
        font-family: 'Noto Sans KR';
        font-style: normal;
        font-weight: 800;
        src: url(data:font/otf;charset=utf-8;base64,${black}) format('opentype');
    }
    @font-face {
        font-family: 'Noto Sans KR';
        font-style: normal;
        font-weight: 300;
        src: url(data:font/otf;charset=utf-8;base64,${medium}) format('opentype');
    }
  `;
