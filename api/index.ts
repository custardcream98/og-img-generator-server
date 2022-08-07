import express, { Request, Response } from 'express';
import { renderToString } from "react-dom/server"
import puppeteer from "puppeteer"
import Main from '../templates/Main';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/ogimage/:title/:subtitle', async(req: Request, res: Response) => {
  const htmlString = renderToString(Main({ title: req.params.title, subtitle: req.params.subtitle }))

  const content = `
<style>
  body {
    margin: 0;
    padding: 0;
    }
</style>

<body>
${htmlString}
</body>
`;
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
    defaultViewport: {
      width: 1200,
      height: 630,
    }
  });
  

  const page = await browser.newPage();
  
  await page.setContent(content, { waitUntil: "domcontentloaded" });  
  // Wait until all images and fonts have loaded
  // await page.evaluate(async () => {
  //   const selectors = Array.from(document.querySelectorAll("img"));
  //   await Promise.all([
  //     document.fonts.ready,
  //    ...selectors.map((img) => {
  //       // Image has already finished loading, let’s see if it worked
  //       if (img.complete) {
  //         // Image loaded and has presence
  //         if (img.naturalHeight !== 0) return;
  //         // Image failed, so it has no height
  //         throw new Error("Image failed to load");
  //       }
  //       // Image hasn’t loaded yet, added an event listener to know when it does
  //       return new Promise((resolve, reject) => {
  //         img.addEventListener("load", resolve);
  //         img.addEventListener("error", reject);
  //       });
  //     }),
  //   ]);
  // });

  const image = await page.screenshot({ omitBackground: true });  
  await browser.close();
  res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': `immutable, no-transform, s-max-age=2592000, max-age=2592000` });
  res.end(image);
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});