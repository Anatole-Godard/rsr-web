import { Navbar } from "@components/Navbar/AppNavbar";
import { Sidebar } from "@components/Sidebar/Sidebar";
import React from "react";

import { motion } from "framer-motion";
import { NextSeo } from "next-seo";
import { Footer } from "@components/Footer/AppFooter";
const variants = {
  hidden: { opacity: 0, x: -200, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: -100 },
};

export const AppLayout: React.FC<any> = ({
  title = "Chargement...",
  children,
}: {
  title?: string;
  children?: React.ReactNode;
}) => {
  return (
    <>
      <NextSeo title={`${title} - RSR`} />
      <div className="flex flex-row max-w-[100vw] min-h-screen">
        <Sidebar />
        <div className="flex flex-col w-full h-full bg-white md:pl-16 md:w-[calc(100%-4rem)] xl:w-[calc(100%-10rem)] xl:pl-[10rem] grow dark:bg-black relative">
          <Navbar />
          <motion.div
            variants={variants} // Pass the variant object into Framer Motion
            initial="hidden" // Set the initial state to variants.hidden
            animate="enter" // Animated state to variants.enter
            exit="exit" // Exit state (used later) to variants.exit
            transition={{ type: "linear" }} // Set the transition to linear
            className="relative flex flex-col max-h-full w-full min-h-full h-[calc(100%-4rem)] top-16 grow"
          >
            {children}
            <div className="w-full ">
              <Footer />
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};
