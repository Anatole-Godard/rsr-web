import Link from "next/link";

export const Logo = ({ className }: { className?: string }) => (
  <Link href="/">
    <a
      className={
        className ||
        "inline-flex items-center my-auto ml-2 pr-6 lg:pr-0 shrink-0 text-xl font-extrabold tracking-wider text-gray-500 uppercase transition duration-300 ease-in-out lg:w-48 text-opacity-80"
      }
    >
      <span className="hidden text-bleuFrance-500 sm:flex">Hello</span>{" "}
      <span className="ml-1 text-rougeMarianne-500">RSR</span>
    </a>
  </Link>
);
