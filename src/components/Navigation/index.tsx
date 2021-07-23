import Link from "next/link";
import styledLocal from "./navigation.module.scss";

type NavigationProps = {
  prevPost: {
    uid: string;
    data: {
      title: string;
    };
  }[];
  afterPost: {
    uid: string;
    data: {
      title: string;
    };
  }[];
};

export default function Navigation({
  prevPost,
  afterPost,
}: NavigationProps): JSX.Element {
  return (
    <div className={styledLocal.ContentPreviousAndNextPost}>
      {prevPost[0]?.uid && (
        <Link href={`/post/${prevPost[0].uid}`}>
          <button type="button">
            <b>{prevPost[0].data.title}</b>
            <span>Post anterior</span>
          </button>
        </Link>
      )}
      {afterPost[0]?.uid && (
        <Link href={`/post/${afterPost[0].uid}`}>
          <button type="button">
            <b>{afterPost[0].data.title}</b>
            <span>Próximo Post</span>
          </button>
        </Link>
      )}
    </div>
  );
}
