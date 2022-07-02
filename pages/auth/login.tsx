import { GuestLayout } from "@components/Layout/GuestLayout";
import { useAuth } from "@hooks/useAuth";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Logo } from "@components/UI/Logo";
import { UserCircleIcon } from "@heroicons/react/outline";
import { GetStaticProps } from "next";
import { useTranslations } from "next-intl";

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const t = useTranslations("Login");

  return (
    <GuestLayout title={t("head-title")}>
      <div className="w-full max-w-sm mx-auto lg:w-96">
        <div>
          <Logo className="flex flex-col text-5xl font-extrabold tracking-wider uppercase text-opacity-80" />

          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 font-marianne dark:text-gray-100">
            {t("title")}
          </h2>
        </div>

        <div className="mt-8">
          <div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("connect-with")}
              </p>

              <div className="grid grid-cols-1 gap-3 mt-1">
                <button
                  disabled
                  className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-500 duration-300 bg-white border border-gray-300 rounded-md shadow-sm dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 group disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="sr-only">Connexion avec France Connect</span>
                  <Image
                    width={24}
                    height={28}
                    src="/img/france_connect.png"
                    alt="France Connect"
                  ></Image>
                  <span className="ml-3 text-xs">France Connect</span>
                </button>
              </div>
            </div>

            <div className="relative mt-6">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500 bg-white dark:bg-gray-900">
                  {t("or-with")}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email && password) signIn(email, password);
              }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t("email")}
                </label>
                <div className="">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-auth"
                    placeholder={t("email")}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t("password")}
                </label>
                <div className="">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-auth"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    disabled
                    className="w-4 h-4 border-gray-300 rounded text-bleuFrance-600 form-checkbox focus:ring-bleuFrance-500 disabled:opacity-75"
                  />
                  <label
                    htmlFor="remember-me"
                    className="block ml-2 text-sm text-gray-900 dark:text-gray-300"
                  >
                    {t("remember-me")}
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium duration-150 font-spectral text-bleuFrance-600 hover:text-bleuFrance-500"
                  >
                    {t("forgot-password")}
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="justify-center w-full btn-bleuFrance"
                >
                  <UserCircleIcon className="w-4 h-4 mr-2" />
                  {t("sign-in")}
                </button>
              </div>
              <div className="inline-flex justify-between w-full my-1 text-sm">
                <Link href="/auth/register">
                  <a className="font-medium duration-150 font-spectral text-bleuFrance-600 hover:text-bleuFrance-500">
                    {t("sign-up")}
                  </a>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    props: {
      i18n: (await import(`../../i18n/${ctx.locale}.json`)).default,
    },
  };
};
