import express, { Request, Response } from 'express';
import { renderToString } from "react-dom/server"
import puppeteer from "puppeteer"
import cors from "cors";
import getFonts from './getFonts';
import Main from '../templates/Main';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors())

app.get('/api/ogimage/:title/:subtitle', async (req: Request, res: Response) => {
  const { title, subtitle } = req.params;
  const htmlString = renderToString(Main({ title, subtitle }))

  const content = `
<style>
  ${getFonts}
  body {
    margin: 0;
    padding: 0;
    }
</style>

<body>
${htmlString}
</body>
`;
  
  const browser = await puppeteer.launch( {
    args: [
    '--no-sandbox',
    '--disable-setuid-sandbox'
  ],
    defaultViewport: {
      width: 1200,
      height: 630,
    }
  })
  

  const page = await browser.newPage();
  
  await page.setContent(content, { waitUntil: "domcontentloaded" });  

  const image = await page.screenshot({ omitBackground: true });  
  await browser.close();
  res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': `immutable, no-transform, s-max-age=2592000, max-age=2592000` });
  res.end(image);
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at PORT : ${port}`);
});


export default app;