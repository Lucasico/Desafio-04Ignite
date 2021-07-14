// https://www.youtube.com/watch?v=HKPWKoxozRk&ab_channel=GBDev

/* eslint-disable react/button-has-type */
import { useState, useEffect } from "react";
import { GetStaticProps } from "next";
import Link from "next/link";
import { format } from "date-fns";
import pt from "date-fns/locale/pt-BR";
import PaginationButton from "../components/Pagination";
import { getPrismicClient } from "../services/prismic";
import styledGlobal from "../styles/common.module.scss";
import styledLocal from "./home.module.scss";

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function Home({ postsPagination }: HomeProps) {
  const [results, setResults] = useState<Post[]>(() => postsPagination.results);
  const { next_page } = postsPagination;

  async function handlePagination(): void {
    const currentPosts = [...results];
    console.log("next_page", next_page);
    const data = await fetch(
      "data https://desafioignite04.cdn.prismic.io/api/v2/documents/sear…ications.title%2Cpublications.subtitle%2Cpublications.author index.tsx:42:12"
    ).then((response) => console.log("response", response));

    console.log("data", data);
  }

  return (
    <>
      {results.map((res: Post) => (
        <Link href={`/post/${res.uid}`} key={res.uid}>
          <main className={styledGlobal.container}>
            <div className={styledLocal.content}>
              <h1>{res.data.title}</h1>
              <span>{res.data.subtitle}</span>
              <div className={styledLocal.contentAutorInfo}>
                <div className={styledLocal.sectionPublicationDate}>
                  <img
                    src="/calendar.svg"
                    alt="calendario"
                    title="calendario"
                  />
                  <time>{res.first_publication_date}</time>
                </div>

                <div className={styledLocal.sectionPublicationAutor}>
                  <img src="/user.svg" alt="calendario" title="calendario" />
                  <span>{res.data.author}</span>
                </div>
              </div>
            </div>
          </main>
        </Link>
      ))}

      <PaginationButton handlePagination={handlePagination} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query("", {
    fetch: [
      "publications.title",
      "publications.subtitle",
      "publications.author",
    ],
    pageSize: 1,
  });

  const { next_page } = postsResponse;
  const { results } = postsResponse;

  const formatedData = results.map((res) => {
    return {
      uid: res.uid,
      first_publication_date: format(
        new Date(res.first_publication_date),
        "dd MMM yyyy",
        { locale: pt }
      ),
      data: res.data,
    };
  });

  const postsPagination = {
    next_page,
    results: formatedData,
  };

  return {
    props: { postsPagination },
    revalidate: 60 * 60,
  };
};
