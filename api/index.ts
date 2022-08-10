import express, { Request, Response } from 'express';
import { renderToString } from "react-dom/server"
import puppeteer from "puppeteer"
import cors from "cors";
import { createHash } from "crypto"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseStorage, adminBucket } from '../firebase';
import Main from '../templates/Main';

function toArrayBuffer(buf:Buffer) {
    const ab = new ArrayBuffer(buf.length);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}

const app = express();
const port = process.env.PORT || 5000;

app.use(cors())

app.get('/og/:title/:subtitle', async (req: Request, res: Response) => {
  const { title, subtitle } = req.params;

  const hashedName = createHash('md5').update(`${title}${subtitle}`).digest('hex')
  const fileName = `thumbnails/${hashedName}.webp`
  const file = adminBucket.file(fileName)
  const storageRef = ref(firebaseStorage, fileName)

  await file.exists().then(
  ).catch(async () => {
    const htmlString = renderToString(Main({ title, subtitle }))
    
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
    await page.setContent(htmlString, { waitUntil: "domcontentloaded" });  
    const image = await page.screenshot({ omitBackground: true, type:'webp', encoding:'binary',});  
    await browser.close();
    
    await uploadBytes(storageRef, toArrayBuffer(image as Buffer))
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