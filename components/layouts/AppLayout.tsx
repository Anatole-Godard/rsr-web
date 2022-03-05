import { Navbar } from "@components/navbar/AppNavbar";
import { Sidebar } from "components/sidebar/Sidebar";
import React from "react";

import { motion } from "framer-motion";

const variants = {
  hidden: { opacity: 0, x: -200, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: -100 },
};

export const AppLayout: React.FC<any> = ({
  topNavigation = { shadow: false },
  children,
}: {
  topNavigation?: any;
  sidebar?: any;
  children?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-row max-w-[100vw] min-h-screen">
      <Sidebar />
      <div className="flex flex-col h-full bg-white md:pl-16 xl:pl-[5rem] grow dark:bg-black">
        <Navbar config={topNavigation} />
        <motion.div
          variants={variants} // Pass the variant object into Framer Motion
          initial="hidden" // Set the initial state to variants.hidden
          animate="enter" // Animated state to variants.enter
          exit="exit" // Exit state (used later) to variants.exit
          transition={{ type: "linear" }} // Set the transition to linear
          className="relative flex flex-col max-h-full min-h-full h-[calc(100vh-4rem)] overflow-y-auto overflow-hidden top-16 grow"
        >
          {/* <Toasts /> */}

          {children}
        </motion.div>
      </div>
    </div>
  );
};
