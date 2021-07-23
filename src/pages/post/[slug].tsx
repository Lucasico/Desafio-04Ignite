/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable react/no-danger */
import { GetStaticPaths, GetStaticProps } from "next";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { RichText } from "prismic-dom";
import { useRouter } from "next/router";
import Prismic from "@prismicio/client";
import Head from "next/head";
import Link from "next/link";
import { getPrismicClient } from "../../services/prismic";
import styledGlobal from "../../styles/common.module.scss";
import styledLocal from "./post.module.scss";
import Comments from "../../components/Comments";
import Navigation from "../../components/Navigation";

interface Post {
  first_publication_date: string | null;
  last_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
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
}

function formatPostUpdateDate(date: string): string {
  const datePublicationUpdate = format(new Date(date), "dd MMM yyyy hh:mm", {
    locale: ptBR,
  });

  const finalFormmattedDate = `${datePublicationUpdate.substring(
    0,
    11
  )}, às ${datePublicationUpdate.substring(11)}`;

  return finalFormmattedDate;
}
export default function Post({
  post,
  prevPost,
  afterPost,
}: PostProps): JSX.Element {
  const router = useRouter();

  const datePublication = format(
    new Date(post.first_publication_date),
    "dd MMM yyyy",
    {
      locale: ptBR,
    }
  );

  const datePublicationUpdate = formatPostUpdateDate(
    post.last_publication_date
  );

  const totalWords = post.data.content.reduce((total, contentItem) => {
    total += contentItem.heading.split(" ").length;
    const words = contentItem.body.map((item) => item.text.split(" ").length);
    words.map((word) => (total += word));
    return total;
  }, 0);

  const readTime = Math.ceil(totalWords / 200);

  return router.isFallback ? (
    <h1>Carregando...</h1>
  ) : (
    <>
      <Head>
        <title>{post.data.title} | spacetraveling</title>
      </Head>
      <div className={styledLocal.contentImg}>
        <img
          src={`${post.data.banner.url}`}
          alt={`${post.data.title}`}
          title={`${post.data.title}`}
        />
      </div>
      <div className={styledGlobal.container}>
        <div className={styledLocal.contentInforTitle}>
          <h1>{post.data.title}</h1>
          <section className={styledLocal.contentAutorInfo}>
            <div className={styledLocal.sectionPublicationDate}>
              <img src="/calendar.svg" alt="calendario" title="calendario" />
              <time>{datePublication}</time>
            </div>
            <div className={styledLocal.sectionPublicationAutor}>
              <img src="/user.svg" alt="calendario" title="calendario" />
              <span>{post.data.author}</span>
            </div>
            <div className={styledLocal.sectionPublicationClock}>
              <img src="/clock.svg" alt="calendario" title="calendario" />
              <span>{readTime} min</span>
            </div>
          </section>
          <div className={styledLocal.contentLastPublication}>
            <span>*Editado em {datePublicationUpdate}</span>
          </div>

          {post.data.content.map((poster) => {
            return (
              <div key={poster.heading}>
                <section className={styledLocal.contentHeaderPost}>
                  <div className={styledLocal.heading}>
                    <h1>{poster.heading}</h1>
                  </div>
                </section>
                <div
                  className={styledLocal.postContent}
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(poster.body),
                  }}
                />
              </div>
            );
          })}
          <Comments />
          <Navigation prevPost={prevPost} afterPost={afterPost} />
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();

  const posts = await prismic.query([
    Prismic.Predicates.at("document.type", "publications"),
  ]);

  const paths = posts.results.map((post) => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID("publications", String(slug), {
    orderings: "[publications.first_publication_date]",
  });

  const prevPost = await prismic.query(
    [Prismic.Predicates.at("document.type", "publications")],
    {
      pageSize: 1,
      after: response.id,
      orderings: "[document.first_publication_date]",
    }
  );

  const afterPost = await prismic.query(
    [Prismic.Predicates.at("document.type", "publications")],
    {
      pageSize: 1,
      after: response.id,
      orderings: "[document.last_publication_date desc]",
    }
  );

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    last_publication_date: response.last_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      author: response.data.author,
      banner: {
        url: response.data.banner.url,
      },
      content: response.data.content.map((content) => {
        return {
          heading: content.heading,
          body: [...content.body],
        };
      }),
    },
  };

  return {
    props: {
      post,
      prevPost: prevPost?.results,
      afterPost: afterPost?.results,
    },
    revalidate: 60 * 60 * 60,
  };
};
