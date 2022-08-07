import express, { Request, Response, NextFunction } from "express"
import path from "path"
import puppeteer from 'puppeteer'

const app = express();

app.use(express.static(path.join(__dirname, "..","..","build")))
app.use(express.static("public"));
// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, "..", "..","build", "index.html"));
// });

app.get('/ogimage', async (req, res) => { // Note the async
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
    defaultViewport: {
      width: 1200,
      height: 630,
    }
  });
  const page = await browser.newPage();
  await page.goto(`${process.env.BASE_URL}?title=${req.query.title}` || `http://localhost:5000/?title=${req.query.title}`);    
  
  // await page.goto(path.join("file://",__dirname, "..","..","build", "index.html"));    
  const element = await page.$('#root');
  const image = await element!.screenshot({ omitBackground: true });  
  await browser.close(); 

  res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': `immutable, no-transform, s-max-age=2592000, max-age=2592000` });
  res.end(image);
});

app.listen(5000, () => {
      console.log("server started on port 5000");
});