import { GuestLayout } from "@components/Layout/GuestLayout";
import { useAuth } from "@hooks/useAuth";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  UserAddIcon,
} from "@heroicons/react/outline";
import { Logo } from "@components/UI/Logo";

import zxcvbn from "zxcvbn";
import { GetStaticProps } from "next";
import { useTranslations } from "next-intl";

export default function Register() {
  const { register } = useAuth();
  const t = useTranslations("Register");
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [fullName, setFullName] = useState("");

  const [validation, setValidation] = useState<{
    email: boolean | null;
    password: boolean | null;
    birthDate: boolean | null;
    fullName: boolean | null;
  }>({
    email: null,
    password: null,
    birthDate: null,
    fullName: null,
  });

  const [passwordScore, setPasswordScore] = useState(0);
  useEffect(() => {
    if (password) {
      const score = zxcvbn(password).score;
      setPasswordScore(score);
    }
  }, [password]);

  return (
    <GuestLayout>
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
            <div className="space-y-4">
              {step === 1 && (
                <>
                  <div className="space-y-1">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {t("email")}
                    </label>
                    <div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setValidation({
                            ...validation,
                            email: true,
                          });
                        }}
                        className={[
                          "input-auth",
                          validation.email === false ? "invalid" : "",
                        ].join(" ")}
                      />
                    </div>
                    {validation.email === false && (
                      <small className="text-xs font-bold text-red-500">
                        {t("email-invalid")}
                      </small>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {t("password")}
                    </label>
                    <div className="flex flex-col mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setValidation({
                            ...validation,
                            password: true,
                          });
                        }}
                        className={[
                          "input-auth",
                          validation.password === false ? "invalid" : "",
                        ].join(" ")}
                      />
                      <div className="h-2 mt-2 bg-gray-200 rounded-full">
                        <div
                          className={[
                            " h-2 rounded-l-full transition-all duration-500 ease-in-out",
                            passwordScore === 0 && password !== ""
                              ? "w-10 bg-red-500"
                              : passwordScore === 1
                              ? "w-1/4 bg-yellow-500"
                              : passwordScore === 2
                              ? "w-1/2 bg-green-500"
                              : passwordScore === 3
                              ? "w-3/4 bg-green-500"
                              : passwordScore === 4
                              ? "w-full bg-bleuFrance-500 animate-pulse rounded-r-full"
                              : "w-0",
                          ].join(" ")}
                        ></div>
                      </div>
                      {password === "" && (
                        <small className="text-xs font-bold text-gray-500">
                          {t("password-required")}
                        </small>
                      )}
                      {passwordScore === 0 && password !== "" && (
                        <small className="text-xs font-bold text-red-500">
                          {t("password-strengh0")}
                        </small>
                      )}
                      {passwordScore === 1 && (
                        <small className="text-xs font-bold text-yellow-500">
                          {t("password-strengh1")}
                        </small>
                      )}
                      {passwordScore === 2 && (
                        <small className="text-xs font-bold text-green-500">
                          {t("password-strengh2")}
                        </small>
                      )}
                      {passwordScore === 3 && (
                        <small className="text-xs font-bold text-green-500">
                          {t("password-strengh3")}
                        </small>
                      )}
                      {passwordScore === 4 && (
                        <small className="text-xs font-bold text-bleuFrance-500">
                          {t("password-strengh4")}
                        </small>
                      )}
                    </div>
                    {validation.password === false && (
                      <small className="text-xs font-bold text-red-500">
                        {t("password-length")}
                      </small>
                    )}
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
                      {t("fullname")}
                    </label>
                    <div>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          setValidation({ ...validation, fullName: true });
                        }}
                        className={[
                          "input-auth",
                          validation.fullName === false ? "invalid" : "",
                        ].join(" ")}
                      />
                    </div>
                    {validation.fullName === false && (
                      <small className="text-xs font-bold text-red-500">
                        {t("fullname-required")}
                      </small>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="birthDate"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {t("birthdate")}
                    </label>
                    <div>
                      <input
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        required
                        value={birthDate}
                        onChange={(e) => {
                          setBirthDate(e.target.value);
                          setValidation({ ...validation, birthDate: true });
                        }}
                        className={[
                          "input-auth",
                          validation.birthDate === false ? "invalid" : "",
                        ].join(" ")}
                      />
                    </div>
                    {validation.birthDate === false && (
                      <small className="text-xs font-bold text-red-500">
                        {t("birthdate-required")}
                      </small>
                    )}
                  </div>
                </>
              )}

              {step === 1 && (
                <div className="inline-flex justify-end w-full">
                  <button
                    onClick={() => {
                      if (
                        email !== "" &&
                        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email) &&
                        password !== "" &&
                        password.length >= 8
                      ) {
                        setStep(2);
                      } else
                        setValidation({
                          ...validation,
                          email:
                            email !== "" &&
                            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email),
                          password: password !== "" && password.length >= 8,
                        });
                    }}
                    className="justify-center w-1/2 btn-bleuFrance"
                  >
                    {t("next")}
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="inline-flex w-full space-x-2">
                  <button
                    onClick={() => setStep(1)}
                    className="justify-center w-1/2 btn-bleuFrance"
                  >
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    {t("back")}
                  </button>
                  <button
                    onClick={() => {
                      if (email && password && fullName && birthDate) {
                        register(email, password, fullName, birthDate);
                      } else {
                        setValidation({
                          ...validation,
                          fullName: fullName !== "",
                          birthDate: birthDate !== "",
                        });
                      }
                    }}
                    className="justify-center w-1/2 btn-bleuFrance"
                  >
                    {t("sign-up")}
                    <UserAddIcon className="w-5 h-5 ml-2" />
                  </button>
                </div>
              )}

              <div className="my-1 text-sm">
                <Link href="/auth/login">
                  <a className="font-medium duration-150 text-bleuFrance-600 hover:text-bleuFrance-500">
                    {t("already-have-account")}
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

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    props: {
      i18n: (await import(`../../i18n/${ctx.locale}.json`)).default,
    },
  };
};
