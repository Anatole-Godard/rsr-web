import Link from "next/link";

export const Logo = ({ className }: { className?: string }) => (
  <Link href="/">
    <a
      className={
        className ||
        "flex flex-col xl:flex-row xl:items-center xl:ml-2 lg:pr-0 shrink-0 text-sm xl:text-xl font-extrabold tracking-wider text-gray-500 uppercase transition duration-300 ease-in-out text-opacity-80"
      }
    >
      <span className="flex text-bleuFrance-500">Hello</span>{" "}
      <span className="-mt-2 xl:mt-0 xl:ml-1 text-rougeMarianne-500">RSR</span>
    </a>
  </Link>
);
