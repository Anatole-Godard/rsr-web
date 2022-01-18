import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  res.send(`
        <html>
            <body>
            <h1>Test</h1>
            </body>
        </html>
    `);
}
