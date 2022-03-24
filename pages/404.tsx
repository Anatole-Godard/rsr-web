import { AppLayout } from "components/layouts/AppLayout";
import type { NextPage } from "next";
import Link from "next/link";

const Error404: NextPage = () => {
  return (
    <AppLayout>
      <div className="h-full px-4 py-16 bg-white sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
        <div className="mx-auto max-w-max">
          <main className="sm:flex">
            <p className="text-4xl font-extrabold text-blue-600 sm:text-6xl">
              404
            </p>
            <div className="sm:ml-6">
              <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 font-marianne sm:text-5xl">
                  {"La page n'existe pas"}
                </h1>
                <p className="mt-2 text-base text-gray-500 font-spectral">
                  {"Merci de bien vérifier l'adresse URL."}
                </p>
              </div>
              <div className="flex mt-10 space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                <Link href="/">
                  <a className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    {"Revenir à l'accueil"}
                  </a>
                </Link>
                <a
                  href="mailto:support@rsr.gouv.fr"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Contacter le webmaster
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AppLayout>
  );
};

export default Error404;
