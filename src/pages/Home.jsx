import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import FilterTabs from "../components/Filter_tabs";
import Subscribe from "../components/Subscribe";
import { getArticles } from "../data/projectData";
import apiUrl from "../constants/apiUrl";

const Home = () => {
  const [articles, setArticles] = useState([]);
  // const articles = [
  //   {
  //     id: 1,
  //     image: image1,
  //     title: "Article Title",
  //     date: "JANUARY 01, 2024",
  //     comments: 5,
  //   },
  //   {
  //     id: 2,
  //     image: image2,
  //     title: "Article Title",
  //     date: "JANUARY 01, 2024",
  //     comments: 0,
  //   },
  //   {
  //     id: 3,
  //     image: image3,
  //     title: "Article Title",
  //     date: "JANUARY 01, 2024",
  //     comments: 3,
  //   },
  // ];

  useEffect(() => {
    const fetchArticle = async () => {
      const { data } = await getArticles();
      setArticles(data.slice(0, 3));
      console.log(data);
    };

    fetchArticle();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 px-24 py-1 bg-[#454545] shadow-md">
        {articles.map((article, index) => (
          <Link
            key={index}
            to={`/blogs/${article.id}`}
            className={`relative border-[1px] border-[#FFE6C7] shadow-lg ${
              index === 0 && "row-span-2 md:-mb-10"
            } ${index === 2 && "-mb-10"}`}
          >
            <img
              className={`${
                index === 0 ? "h-full" : "h-[15rem]"
              } w-full object-cover`}
              src={`${apiUrl}${article.image}`}
              alt=""
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black"></div>
            <div className="absolute bottom-0 left-0 p-4 text-[#FFE6C7]">
              <h2 className="text-3xl font-bold">{article.title}</h2>
              <p className="text-sm">
                {article.date} | JEAN LIONEL | {article.comments.length}{" "}
                {article.comments.length === 1 ? "COMMENT" : "COMMENTS"}
              </p>
              {article.comments.length === 0 && (
                <p className="text-sm">No comments yet</p>
              )}
            </div>
          </Link>
        ))}
      </div>
      <div className="flex flex-col xl:flex-row">
        <FilterTabs />
        <Subscribe />
      </div>
    </>
  );
};

export default Home;
