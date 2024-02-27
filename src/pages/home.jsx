import image1 from "../assets/images/fire-making.jpg";
import image2 from "../assets/images/lamp.jpg";
import image3 from "../assets/images/carpentry.jpg";
import { Link } from "react-router-dom";
import FilterTabs from "../components/filter_tabs";
import Subscribe from "../components/subscribe";

const Home = () => {
  const articles = [
    {
      id: 1,
      image: image1,
      title: "Article Title",
      date: "JANUARY 01, 2024",
      comments: 5,
    },
    {
      id: 2,
      image: image2,
      title: "Article Title",
      date: "JANUARY 01, 2024",
      comments: 0,
    },
    {
      id: 3,
      image: image3,
      title: "Article Title",
      date: "JANUARY 01, 2024",
      comments: 3,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2 gap-1 px-24 py-1 bg-[#454545] shadow-md">
        {articles.map((article, index) => (
          <Link
            key={index}
            to={`/article/${article.id}`}
            className={`relative border-[1px] border-[#FFE6C7] shadow-lg ${
              index === 0 && "row-span-2 -mb-10"
            } ${index === 2 && "-mb-10"}`}
          >
            <img
              className={`${
                index === 0 ? "h-full" : "h-[15rem]"
              } w-full object-cover`}
              src={article.image}
              alt=""
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black"></div>
            <div className="absolute bottom-0 left-0 p-4 text-[#FFE6C7]">
              <h2 className="text-3xl font-bold">{article.title}</h2>
              <p className="text-sm">
                {article.date} | JEAN LIONEL | {article.comments}{" "}
                {article.comments === 1 ? "COMMENT" : "COMMENTS"}
              </p>
              {article.comments === 0 && (
                <p className="text-sm">No comments yet</p>
              )}
            </div>
          </Link>
        ))}
      </div>
      <div className="flex flex-row">
        <FilterTabs />
        <Subscribe />
      </div>
    </>
  );
};

export default Home;
