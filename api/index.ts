import express, { Request, Response } from "express";
import { renderToString } from "react-dom/server";
import bodyParser from "body-parser";
import puppeteer from "puppeteer";
import cors from "cors";
import { createHash } from "crypto";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseStorage, adminBucket } from "../firebase";
import getFonts from "./getFonts";
import Main from "../templates/Main";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post("/og", async (req: Request, res: Response) => {
  const { title, subtitle } = req.body;

  console.info(`Status ${Date.now()} ${subtitle} init`);

  const hashedName = createHash("md5").update(`${title}${subtitle}`).digest("hex");
  const fileName = `thumbnails/${hashedName}.webp`;
  const file = adminBucket.file(fileName, {});
  const storageRef = ref(firebaseStorage, fileName);

  const [isExists] = await file.exists();

  if (!isExists) {
    console.warn(`Status ${Date.now()} ${subtitle} 이미지 생성`);

    const htmlString = renderToString(Main({ title, subtitle }));

    const content = `
        <style>
          ${getFonts}

          body {
            margin: 0;
            padding: 0;
          }

          h1, p {
            margin: 0;
            padding: 0;
          }
          </style>
          <body>
          ${htmlString}
          </body>
        `;

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      defaultViewport: {
        width: 1200,
        height: 630,
      },
    });

    const page = await browser.newPage();
    await page.setContent(content, { waitUntil: "domcontentloaded" });
    const image = await page.screenshot({
      omitBackground: true,
      type: "webp",
      encoding: "binary",
    });
    await browser.close();

    console.warn(`Status ${Date.now()} ${subtitle} 이미지 생성 완료`);

    await uploadBytes(storageRef, (image as Buffer).buffer);
    console.warn(`Status ${Date.now()} ${subtitle} 이미지 업로드 완료`);
  }

  res.send({ created: await getDownloadURL(storageRef) });
});

app.get("/", async (req: Request, res: Response) => {
  const htmlString = renderToString(
    Main({ title: "개발자 시우의 블로그", subtitle: "테스트 문구" })
  );

  const content = `
  <style>
    ${getFonts}
      
    body {
      margin: 0;
      padding: 0;
      width: 100vw;
      height: 52.5vw;
    }

    h1, p {
      margin: 0;
      padding: 0;
    }
    </style>
    <body>
    ${htmlString}
    </body>
  `;

  // const browser = await puppeteer.launch( {
  //   args: [
  //   '--no-sandbox',
  //   '--disable-setuid-sandbox'
  // ],
  //   defaultViewport: {
  //     width: 100vw,
  //     height: 630,
  //   }
  // })

  // const page = await browser.newPage();
  // await page.setContent(content, { waitUntil: "domcontentloaded" });
  // const image = await page.screenshot({ omitBackground: true, type:'webp', encoding:'binary',});
  // await browser.close();
  res.send(content);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at PORT : ${port}`);
});

app.on("error", (e) => {
  console.log(e);
});

export default app;
