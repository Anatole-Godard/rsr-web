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
  sidebar = {},
  children,
}: {
  topNavigation?: any;
  sidebar?: any;
  children?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col w-screen min-h-screen">
      <Navbar config={topNavigation} />
      <div className="flex flex-row w-full min-h-[calc(100vh-4rem)] bg-white dark:bg-black">
        <Sidebar config={sidebar} />
        <motion.div
          variants={variants} // Pass the variant object into Framer Motion
          initial="hidden" // Set the initial state to variants.hidden
          animate="enter" // Animated state to variants.enter
          exit="exit" // Exit state (used later) to variants.exit
          transition={{ type: "linear" }} // Set the transition to linear
          className="flex flex-col w-full min-h-full"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};
