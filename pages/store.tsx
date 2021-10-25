import { AppLayout } from "@components/layouts/AppLayout";
import { ArrowRightIcon } from "@heroicons/react/outline";
import { NextPage } from "next";
import { useTheme } from "next-themes";
import Link from "next/link";

const Store: NextPage = () => {
  const { theme, setTheme } = useTheme();
  console.log(theme);

  const color = Math.random() > 0.5 ? "#000091" : "#E1000F";
  const background =
    theme === "light"
      ? "-webkit-linear-gradient(top, " +
        color +
        "C0, #ffffffff), url('https://picsum.photos/1600/600')"
      : "-webkit-linear-gradient(top, " +
        color +
        "C0, #000000ff), url('https://picsum.photos/1600/600')";

  return (
    <AppLayout>
      <div
        className="z-20 flex flex-col items-start justify-center w-full p-12 bg-opacity-50 h-96 filter backdrop-brightness-50"
        style={{
          background: background,
          opacity: 0.9,
        }}
      >
        <h5 className="text-gray-800 opacity-100 dark:text-gray-200 text-md filter font-marianne">
          La ressource phare en ce moment! 😎
        </h5>
        <h5 className="text-3xl font-extrabold text-black opacity-100 dark:text-white filter font-marianne">
          Le ministère de la santé et de la solidarité crée une plateforme
          d'échange
        </h5>
        <Link href="/">
          <a className="inline-flex items-center mt-4 font-bold text-black opacity-100 text-md dark:text-white filter font-marianne">
            Voir plus
            <ArrowRightIcon className="w-4 h-4 ml-2 -mb-1" />
          </a>
        </Link>
      </div>
      <div className="z-30 hidden grid-cols-2 gap-3 p-6 -mt-16 md:grid xl:grid-cols-6 xl:gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <LittleCard key={item} />
        ))}
      </div>
    </AppLayout>
  );
};

const LittleCard = () => {
  return <div className="w-full h-24 bg-white shadow-lg rounded-xl"></div>;
};

export default Store;
