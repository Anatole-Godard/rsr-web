import Link from "next/link";

export const Logo = ({ className }: { className?: string }) => (
  <Link href="/">
    <a
      className={
        className ||
        "flex flex-col mx-auto w-max xl:mt-2 xl:my-6 lg:pr-0 shrink-0 text-sm xl:text-xl font-extrabold tracking-wider text-gray-500 uppercase transition duration-300 ease-in-out text-opacity-80"
      }
    >
      <span className="flex text-bleuFrance-500">Hello</span>{" "}
      <span className="-mt-2 text-rougeMarianne-500">RSR</span>
    </a>
  </Link>
);
