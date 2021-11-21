import { GuestLayout } from "@components/layouts/GuestLayout";
import { useAuth } from "@hooks/useAuth";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  UserAddIcon,
} from "@heroicons/react/outline";
import { Logo } from "@components/ui/Logo";

export default function Register() {
  const { register } = useAuth();
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [fullName, setFullName] = useState("");

  return (
    <GuestLayout>
      <div className="w-full max-w-sm mx-auto lg:w-96">
        <div>
          <Logo className="inline-flex items-center text-5xl font-extrabold tracking-wider uppercase text-opacity-80" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Se créer un compte RSR
          </h2>
        </div>

        <div className="mt-8">
          <div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enregistrez-vous avec
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
                  Ou enregistrer vous avec
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="space-y-4">
              {/* <div className="w-full h-2 bg-gray-300 rounded-full">
                <div
                  className={[
                    step === 1 ? "w-[10px]" : "w-1/2",
                    "bg-blue-500 h-2 rounded-l-full transition-all duration-500 ease-in-out",
                  ].join(" ")}
                ></div>
              </div> */}
              {step === 1 && (
                <>
                  <div className="space-y-1">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Adresse email
                    </label>
                    <div>
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
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-1">
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Nom complet
                    </label>
                    <div>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="block w-full px-3 py-2 placeholder-gray-400 duration-300 border border-gray-300 rounded-md shadow-sm appearance-none dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:outline-none dark:focus:ring-blue-500 dark:focus:border-blue-500 sm:text-sm disabled:opacity-75"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="birthDate"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Date de naissance
                    </label>
                    <div className="mt-1">
                      <input
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        required
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="block w-full px-3 py-2 placeholder-gray-400 duration-300 border border-gray-300 rounded-md shadow-sm appearance-none dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:outline-none dark:focus:ring-blue-500 dark:focus:border-blue-500 sm:text-sm disabled:opacity-75"
                      />
                    </div>
                  </div>
                </>
              )}

              {step === 1 && (
                <div className="inline-flex justify-end w-full">
                  <button
                    onClick={() => {
                      if (email && password) {
                        setStep(2);
                      }
                    }}
                    className="inline-flex items-center justify-center w-1/2 px-4 py-2 text-sm font-medium text-white duration-300 bg-blue-600 rounded-md shadow-sm disabled:cursor-not-allowed hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
                  >
                    Continuer
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="inline-flex w-full space-x-2">
                  <button
                    onClick={() => setStep(1)}
                    className="inline-flex items-center justify-center flex-shrink-0 w-1/2 px-4 py-2 text-sm font-medium text-white duration-300 bg-blue-600 rounded-md shadow-sm disabled:cursor-not-allowed hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
                  >
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Retour
                  </button>
                  <button
                    onClick={() => {
                      if (email && password && fullName && birthDate) {
                        register(email, password, fullName, birthDate);
                      }
                    }}
                    className="inline-flex items-center justify-center flex-shrink-0 w-1/2 px-4 py-2 text-sm font-medium text-white duration-300 bg-blue-600 rounded-md shadow-sm disabled:cursor-not-allowed hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
                  >
                    S'enregistrer
                    <UserAddIcon className="w-5 h-5 ml-2" />
                  </button>
                </div>
              )}

              <div className="my-1 text-sm">
                <Link href="/auth/login">
                  <a className="font-medium text-blue-600 duration-150 hover:text-blue-500">
                    Se connecter
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}
