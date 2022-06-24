import { AppLayout } from "@components/Layout/AppLayout";
import type { NextPage } from "next";
import Link from "next/link";

const Error500: NextPage = () => {
  return (
    <AppLayout>
      <div className="h-full px-4 py-16 bg-white dark:bg-black sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
        <div className="mx-auto max-w-max">
          <main className="sm:flex">
            <p className="text-4xl font-extrabold text-bleuFrance-600 dark:text-bleuFrance-200 sm:text-6xl">
              404
            </p>
            <div className="sm:ml-6">
              <div className="sm:border-l sm:border-gray-200 dark:border-gray-700 sm:pl-6">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 font-marianne sm:text-5xl">
                  {"L'application a rencontré une erreur"}
                </h1>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400 font-spectral">
                  {"Merci de bien vouloir contacter le support client."}
                </p>
              </div>
              <div className="flex mt-10 space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                <Link href="/">
                  <a className="btn-bleuFrance">
                    {"Revenir à l'accueil"}
                  </a>
                </Link>
                <a
                  href="mailto:support@rsr.gouv.fr"
                  className="btn-text-gray"
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

export default Error500;
