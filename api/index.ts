import express, { Request, Response } from 'express';
import { renderToString } from "react-dom/server"

import Main from '../templates/Main';
import dotenv from 'dotenv';

let chrome = {args:[],
executablePath:""};
let puppeteer;

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.get('/api', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/api/ogimage/:title/:subtitle', async (req: Request, res: Response) => {
  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    chrome = await import("chrome-aws-lambda");
    puppeteer = await import("puppeteer-core");
  } else {
    puppeteer = await import("puppeteer")
  }

  const { title, subtitle } = req.params;
  const htmlString = renderToString(Main({ title, subtitle }))

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
    args: [...chrome.args, '--hide-scrollbars', '--disable-web-security'],
      executablePath: await chrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
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

if (process.env.DEV) {
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at PORT : ${port}`);
  });
}

export default app;