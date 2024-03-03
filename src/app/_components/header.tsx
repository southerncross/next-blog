import Link from "next/link";

import { SITE_NAME } from "@/lib/constants";
import ThemeSwitcher from "./theme-switcher";
import GithubIcon from "./github-icon";

const Header = () => {
  return (
    <h2 className="flex flex-row justify-between items-center text-2xl md:text-3xl font-bold tracking-tight md:tracking-tighter leading-tight mb-20 mt-8 text-gray-400">
      <Link href="/" className="hover:underline">
        {SITE_NAME}
      </Link>
      <span className="flex flex-row items-center ml-2">
        <GithubIcon />
        <ThemeSwitcher className="ml-3" />
      </span>
    </h2>
  );
};

export default Header;
