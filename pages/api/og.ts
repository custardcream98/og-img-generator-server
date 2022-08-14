import { NextApiRequest, NextApiResponse } from "next";
import { renderToString } from "react-dom/server"
import playwright from "playwright-aws-lambda"
import { createHash } from "crypto"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseStorage, adminBucket } from '../../lib/firebase';
import getFonts from '../../lib/getFonts';
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
    
    const browser = await playwright.launchChromium({
      headless:true,
      args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
      ],
    })
    // const context = await browser.newContext()
    // const page = await context.newPage();
    const page = await browser.newPage();
    await page.setViewportSize({
      width: 1200,
      height: 630,
    });
    await page.setContent(content, { waitUntil: "domcontentloaded" });  
    const image = await page.screenshot({ omitBackground: true});  
    await browser.close();
    // await context.close();
    
    await uploadBytes(storageRef, (image as Buffer).buffer)
  })
  res.send({created:await getDownloadURL(storageRef)})
};