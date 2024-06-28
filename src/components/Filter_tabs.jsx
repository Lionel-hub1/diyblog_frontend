import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getArticles } from "../data/projectData";
import apiUrl from "../constants/apiUrl";

const FilterTabs = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [articles, setArticles] = useState([]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const fetchArticle = async () => {
      const { data } = await getArticles();
      setArticles(data.slice(0, 3));
    };

    fetchArticle();
  }, []);

  const tabs = [
    { id: 1, name: "All" },
    { id: 2, name: "DIY" },
    { id: 3, name: "Home Improvement" },
    { id: 4, name: "Decor" },
    { id: 5, name: "Renovation" },
  ];

  // const articlesList = [
  //   {
  //     id: 1,
  //     image: image1,
  //     title: "Article Title",
  //     date: "JANUARY 01, 2024",
  //     type: "DIY",
  //     comments: 5,
  //     content:
  //       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, repudiandae possimus! Quam deserunt perspiciatis sed modi recusandae porro, inventore ducimus maiores natus? Obcaecati amet, fuga ex minus cupiditate facilis aperiam.",
  //   },
  //   {
  //     id: 2,
  //     image: image2,
  //     title: "Article Title",
  //     date: "JANUARY 01, 2024",
  //     type: "Home Improvement",
  //     comments: 0,
  //     content:
  //       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, repudiandae possimus! Quam deserunt perspiciatis sed modi recusandae porro, inventore ducimus maiores natus? Obcaecati amet, fuga ex minus cupiditate facilis aperiam.",
  //   },
  //   {
  //     id: 3,
  //     image: image3,
  //     title: "Article Title",
  //     date: "JANUARY 01, 2024",
  //     type: "Decor",
  //     comments: 3,
  //     content:
  //       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, repudiandae possimus! Quam deserunt perspiciatis sed modi recusandae porro, inventore ducimus maiores natus? Obcaecati amet, fuga ex minus cupiditate facilis aperiam.",
  //   },
  //   {
  //     id: 4,
  //     image: image1,
  //     title: "Article Title",
  //     date: "JANUARY 01, 2024",
  //     type: "Renovation",
  //     comments: 2,
  //     content:
  //       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, repudiandae possimus! Quam deserunt perspiciatis sed modi recusandae porro, inventore ducimus maiores natus? Obcaecati amet, fuga ex minus cupiditate facilis aperiam.",
  //   },
  //   {
  //     id: 5,
  //     image: image2,
  //     title: "Article Title",
  //     date: "JANUARY 01, 2024",
  //     type: "DIY",
  //     comments: 1,
  //     content:
  //       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, repudiandae possimus! Quam deserunt perspiciatis sed modi recusandae porro, inventore ducimus maiores natus? Obcaecati amet, fuga ex minus cupiditate facilis aperiam.",
  //   },
  //   {
  //     id: 6,
  //     image: image3,
  //     title: "Article Title",
  //     date: "JANUARY 01, 2024",
  //     type: "Home Improvement",
  //     comments: 4,
  //     content:
  //       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, repudiandae possimus! Quam deserunt perspiciatis sed modi recusandae porro, inventore ducimus maiores natus? Obcaecati amet, fuga ex minus cupiditate facilis aperiam.",
  //   },
  //   {
  //     id: 7,
  //     image: image1,
  //     title: "Article Title",
  //     date: "JANUARY 01, 2024",
  //     type: "Decor",
  //     comments: 6,
  //     content:
  //       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, repudiandae possimus! Quam deserunt perspiciatis sed modi recusandae porro, inventore ducimus maiores natus? Obcaecati amet, fuga ex minus cupiditate facilis aperiam.",
  //   },
  //   {
  //     id: 8,
  //     image: image2,
  //     title: "Article Title",
  //     date: "JANUARY 01, 2024",
  //     type: "Renovation",
  //     comments: 7,
  //     content:
  //       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, repudiandae possimus! Quam deserunt perspiciatis sed modi recusandae porro, inventore ducimus maiores natus? Obcaecati amet, fuga ex minus cupiditate facilis aperiam.",
  //   },
  //   {
  //     id: 9,
  //     image: image3,
  //     title: "Article Title",
  //     date: "JANUARY 01, 2024",
  //     type: "DIY",
  //     comments: 8,
  //     content:
  //       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, repudiandae possimus! Quam deserunt perspiciatis sed modi recusandae porro, inventore ducimus maiores natus? Obcaecati amet, fuga ex minus cupiditate facilis aperiam.",
  //   },
  //   {
  //     id: 10,
  //     image: image1,
  //     title: "Article Title",
  //     date: "JANUARY 01, 2024",
  //     type: "Home Improvement",
  //     comments: 9,
  //     content:
  //       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, repudiandae possimus! Quam deserunt perspiciatis sed modi recusandae porro, inventore ducimus maiores natus? Obcaecati amet, fuga ex minus cupiditate facilis aperiam.",
  //   },
  // ];

  const filteredArticles = articles.filter(
    (article) => activeTab === "All" || article.type === activeTab
  );

  return (
    <div className="flex flex-col w-full">
      <div className="mx-4 sm:mx-14 lg:mx-24 xl:mr-10 sm:border-b-[2px] text-[#454545] mt-16 space-x-10 font-semibold">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.name)}
            className={`${activeTab === tab.name
              ? "bg-[#FFA559] px-3 py-1 rounded-full sm:bg-transparent sm:px-0 sm:py-0 sm:rounded-none text-white sm:border-[#FFA559] sm:text-[#FFA559] transition duration-300 ease-in-out"
              : "sm:border-transparent"
              } sm:border-b-[2px] -mb-1 focus:outline-none uppercase`}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className="px-4 sm:px-14 lg:px-24 py-10">
        {filteredArticles[0] ? (
          filteredArticles.map((article, index) => (
            <div key={index} className="flex max-h-[7rem] sm:max-h-[15rem] shadow-md mb-8">
              <img
                className="min-w-[7rem] max-w-[7rem] h-[7rem] sm:min-w-[15rem] sm:max-w-[15rem] sm:h-[15rem] object-cover"
                src={`${apiUrl}${article.image}`}
                alt=""
              />
              <div className="flex flex-col px-2 sm:p-4">
                <h2 className="text-md sm:text-2xl text-[#454545] font-bold line-clamp-1">
                  {article.title} {article.type}
                </h2>
                <p className="text-xs sm:text-sm sm:mt-2 line-clamp-1">{article.date}</p>
                <p className="sm:mt-4 line-clamp-2 sm:line-clamp-4 text-gray-600">{article.content}</p>
                <div className="flex flex-row justify-between mt-2">
                  <Link
                    to={`/blogs/${article.id}`}
                    className="text-[#FFA559] font-semibold"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center">No articles found</div>
        )}
      </div>
    </div>
  );
};

export default FilterTabs;
