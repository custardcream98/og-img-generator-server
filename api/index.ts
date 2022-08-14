import express, { Request, Response } from 'express';
import { renderToString } from "react-dom/server"
import playwright from "playwright"
import cors from "cors";
import { createHash } from "crypto"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseStorage, adminBucket } from '../lib/firebase';
import getFonts from '../lib/getFonts';
import Main from '../lib/templates/Main';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors())

app.get('/og/:title/:subtitle', async (req: Request, res: Response) => {
  const { title, subtitle } = req.params;

  const hashedName = createHash('md5').update(`${title}${subtitle}`).digest('hex')
  const fileName = `thumbnails/${hashedName}.png`
  const file = adminBucket.file(fileName)
  const storageRef = ref(firebaseStorage, fileName)

  await file.exists().then(
  ).catch(async () => {
    const htmlString = renderToString(Main({ title, subtitle }))

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
    `
    
    const browser = await playwright.chromium.launch( {
      args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
      ],
    })
    
    const page = await browser.newPage();
    await page.setViewportSize({
      width: 1200,
      height: 630,
    });
    await page.setContent(content, { waitUntil: "domcontentloaded" });  
    const image = await page.screenshot({ omitBackground: true});  
    await browser.close();
    
    await uploadBytes(storageRef, (image as Buffer).buffer)
  })
  res.send({created:await getDownloadURL(storageRef)})
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at PORT : ${port}`);
});

app.on('error', (e) => {
  console.log(e)
})

export default app;