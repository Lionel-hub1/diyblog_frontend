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
      <div className="px-4 py-10 sm:px-14 lg:px-24">
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
                <p className="text-gray-600 sm:mt-4 line-clamp-2 sm:line-clamp-4">{article.content}</p>
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
