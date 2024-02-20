import Link from "next/link";

import { SITE_NAME } from "@/lib/constants";

const Header = () => {
  return (
    <h2 className="text-2xl md:text-3xl font-bold tracking-tight md:tracking-tighter leading-tight mb-20 mt-8 text-neutral-400">
      <Link href="/" className="hover:underline">
        {SITE_NAME}
      </Link>
      .
    </h2>
  );
};

export default Header;
