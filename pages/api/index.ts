import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  res.send(`
  <!doctype html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="h-screen w-screen">
    <div class="h-full px-4 py-16 bg-white sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div class="mx-auto max-w-max">
        <main class="sm:flex">
          <p class="text-4xl font-extrabold text-blue-600 sm:text-6xl">
            404
          </p>
          <div class="sm:ml-6">
            <div class="sm:border-l sm:border-gray-200 sm:pl-6">
              <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                La documentation API est en cours de construction
              </h1>
              <p class="mt-2 text-base text-gray-500">
                Merci de revenir plus tard.
              </p>
            </div>
            <div class="flex mt-10 space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                <a href="/" class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Revenir à l'accueil
                </a>
                <a href="mailto:support@rsr.gouv.fr" class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Contacter le webmaster
                </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  </body>
  </html>
    `);
}
