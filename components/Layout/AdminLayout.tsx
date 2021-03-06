import { NavbarAdmin } from "@components/Navbar/AdminNavbar";
import { SidebarAdmin } from "@components/Sidebar/SidebarAdmin";
import { FC, ReactNode } from "react";

import { motion } from "framer-motion";
import { NextSeo } from "next-seo";

const variants = {
  hidden: { opacity: 0, x: -200, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: -100 },
};

export const AdminLayout: FC<any> = ({
  title = "Chargement...",
  children,
}: {
  title?: string;
  children?: ReactNode;
}) => {
  return (
    <>
      <NextSeo title={`${title} - RSR`} />
      <div className="flex flex-row max-w-[100vw] min-h-screen">
        <SidebarAdmin />
        <div className="flex flex-col h-full bg-white md:pl-16 xl:pl-[10rem] grow dark:bg-black">
          <NavbarAdmin />
          <motion.div
            variants={variants} // Pass the variant object into Framer Motion
            initial="hidden" // Set the initial state to variants.hidden
            animate="enter" // Animated state to variants.enter
            exit="exit" // Exit state (used later) to variants.exit
            transition={{ type: "linear" }} // Set the transition to linear
            className="relative flex flex-col h-screen max-h-full min-h-full overflow-hidden overflow-y-auto grow"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </>
  );
};
