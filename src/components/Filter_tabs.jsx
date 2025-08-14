import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getArticles } from "../data/projectData";
import apiUrl from "../constants/apiUrl";

const FilterTabs = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      try {
        const { data } = await getArticles();
        setArticles(data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setIsLoading(false);
      }
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col w-full">
      <div className="mx-4 mt-16 sm:mx-14 lg:mx-24 xl:mr-10">
        <h2 className="text-2xl font-bold text-[#454545] mb-6">
          Explore Articles
        </h2>

        <div className="flex flex-wrap gap-3 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.name)}
              className={`${activeTab === tab.name
                  ? "bg-[#FFA559] text-white shadow-md"
                  : "bg-gray-100 text-[#454545] hover:bg-gray-200"
                } px-4 py-2 rounded-full text-sm font-medium transition-all duration-300`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-6 sm:px-14 lg:px-24">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-[#FFA559] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredArticles.map((article, index) => (
              <Link
                key={index}
                to={`/blogs/${article.id}`}
                className="flex flex-col overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md sm:flex-row hover:shadow-lg"
              >
                <div className="overflow-hidden sm:w-1/3">
                  <img
                    className="object-cover w-full h-48 transition-transform duration-500 transform sm:h-full hover:scale-105"
                    src={`${apiUrl}${article.image}`}
                    alt={article.title}
                  />
                </div>
                <div className="flex flex-col p-4 sm:p-6 sm:w-2/3">
                  <div className="flex-grow">
                    <div className="flex items-center mb-2 space-x-2">
                      <span className="text-xs text-gray-500">
                        {formatDate(article.created_at)}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs bg-[#FFA559]/10 text-[#FFA559] px-2 py-1 rounded-full">
                        {article.type || "DIY"}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-[#454545] mb-2 hover:text-[#FFA559] transition-colors duration-200">
                      {article.title}
                    </h2>

                    <p className="mb-4 text-gray-600 line-clamp-3">
                      {article.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                    <Link
                      to={`/blogs/${article.id}`}
                      className="inline-flex items-center font-medium text-[#FFA559] hover:text-[#ff9233]"
                    >
                      Read More
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 ml-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </Link>

                    <div className="flex items-center text-sm text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                      <span>
                        {article.comments.length}{" "}
                        {article.comments.length === 1 ? "comment" : "comments"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="text-lg text-gray-500">
              No articles found in this category
            </p>
            <button
              onClick={() => setActiveTab("All")}
              className="mt-4 text-[#FFA559] font-medium hover:underline"
            >
              View all articles instead
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/blogs"
            className="inline-flex items-center px-6 py-3 bg-[#454545] text-white font-bold rounded-md hover:bg-[#353535] transition-all duration-300"
          >
            View All Articles
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FilterTabs;
