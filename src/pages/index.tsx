// https://www.youtube.com/watch?v=HKPWKoxozRk&ab_channel=GBDev

/* eslint-disable react/button-has-type */
import { useState } from "react";
import { GetStaticProps } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Prismic from "@prismicio/client";
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

function formmatedValuesPost(posts: Post[]): Post[] {
  const returnValues = posts.map((post) => {
    return {
      ...post,
      first_publication_date: format(
        new Date(post.first_publication_date),
        "dd MMM yyyy",
        {
          locale: ptBR,
        }
      ),
    };
  });

  return returnValues;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const formattedResults = formmatedValuesPost(postsPagination.results);
  const [results, setResults] = useState<Post[]>(formattedResults);
  const [nextPage, setNextPage] = useState<string | null>(
    postsPagination.next_page
  );

  async function handleNewPosts(): Promise<void> {
    if (nextPage !== null) {
      const currentPosts = [...results];
      const responseData = await fetch(`${nextPage}`).then((response) =>
        response.json()
      );
      const newNextPage = responseData.next_page;
      const newResults = responseData.results;
      const formattedNewResults = formmatedValuesPost(newResults);

      setNextPage(newNextPage);
      setResults([...currentPosts, ...formattedNewResults]);
    }
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

      {nextPage && <PaginationButton handlePagination={handleNewPosts} />}
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.Predicates.at("document.type", "publications")],
    {
      fetch: [
        "publications.title",
        "publications.subtitle",
        "publications.author",
      ],
      pageSize: 1,
    }
  );

  const { next_page } = postsResponse;
  const { results } = postsResponse;

  const publications = results.map((publication) => {
    return {
      uid: publication.uid,
      first_publication_date: publication.first_publication_date,
      data: {
        title: publication.data.title,
        subtitle: publication.data.subtitle,
        author: publication.data.author,
      },
    };
  });

  const postsPagination = {
    next_page,
    results: publications,
  };

  return {
    props: { postsPagination },
    revalidate: 60 * 60,
  };
};
