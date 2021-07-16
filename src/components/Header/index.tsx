import Image from "next/image";
import Link from "next/link";
import styledGlobal from "../../styles/common.module.scss";
import styledLocal from "./header.module.scss";

export default function Header(): JSX.Element {
  // TODO
  return (
    <div className={styledGlobal.container}>
      <div className={styledLocal.contentLogo}>
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="logo"
            width={238}
            height={25}
            title="spacetraveling"
          />
        </Link>
      </div>
    </div>
  );
}
