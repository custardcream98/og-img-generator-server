import { NextApiRequest, NextApiResponse } from "next";
import { renderToString } from "react-dom/server"
import chrome from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';
import { createHash } from "crypto"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseStorage, adminBucket } from '../../lib/firebase';
// import getFonts from '../../lib/getFonts';
import Main from '../../lib/templates/Main';

export default async (req: NextApiRequest, res: NextApiResponse, ...props) => {  
  const { title, subtitle } = req.query;

  const hashedName = createHash('md5').update(`${title}${subtitle}`).digest('hex')
  const fileName = `thumbnails/${hashedName}.png`
  const file = adminBucket.file(fileName)
  const storageRef = ref(firebaseStorage, fileName)

  await file.exists().then(
  ).catch(async () => {
    const htmlString = renderToString(Main({ title:title as string, subtitle: subtitle as string }))

    const content = `
    <style>
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
    
    const options = process.env.AWS_REGION
    ? {
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless
      }
    : {
        args: [],
        executablePath:
          '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      };
    const browser = await puppeteer.launch(options)
    const page = await browser.newPage();
    await page.setViewport({
      width: 1200,
      height: 630,
    });
    await page.setContent(content, { waitUntil: "domcontentloaded" });  
    const image = await page.screenshot({ omitBackground: true, type:'png'});  
    await browser.close();
    
    await uploadBytes(storageRef, (image as Buffer).buffer)
  })

  res.send({created:await getDownloadURL(storageRef)})
};