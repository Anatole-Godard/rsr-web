import { GuestLayout } from "@components/layouts/GuestLayout";
import { useAuth } from "@hooks/useAuth";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <GuestLayout>
      <div className="w-full max-w-sm mx-auto lg:w-96">
        <div>
          <Link href="/">
            <a>
              <img className="w-auto h-12" src="/logo.svg" alt="OpenMeet" />
            </a>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Connexion à RSR
          </h2>
        </div>

        <div className="mt-8">
          <div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Connectez-vous avec France Connect
              </p>

              <div className="grid grid-cols-3 gap-3 mt-1">
                <button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-500 duration-300 bg-white border border-gray-300 rounded-md shadow-sm dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 group">
                  <span className="sr-only">
                    Connexion avec France Connect
                  </span>
                  <Image
                    width={24}
                    height={28}
                    src="/img/france_connect.png"
                    alt="France Connect"
                  ></Image>
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
                  Ou continuez avec
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Adresse email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-3 py-2 placeholder-gray-400 duration-300 border border-gray-300 rounded-md shadow-sm appearance-none dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:outline-none dark:focus:ring-blue-500 dark:focus:border-blue-500 sm:text-sm disabled:opacity-75"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Mot de passe
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-3 py-2 placeholder-gray-400 duration-300 border border-gray-300 rounded-md shadow-sm appearance-none dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:outline-none dark:focus:ring-blue-500 dark:focus:border-blue-500 sm:text-sm disabled:opacity-75"
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
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded form-checkbox focus:ring-blue-500 disabled:opacity-75"
                  />
                  <label
                    htmlFor="remember-me"
                    className="block ml-2 text-sm text-gray-900 dark:text-gray-300"
                  >
                    Se souvenir de moi
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-blue-600 duration-150 hover:text-blue-500"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>
              </div>

              <div>
                <button
                  onClick={() => {
                    if (email && password) signIn(email, password);
                  }}
                  className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white duration-300 bg-blue-600 rounded-md shadow-sm disabled:cursor-not-allowed hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
                >
                  Se connecter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}
