import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getArticles } from "../data/projectData";
import apiUrl from "../constants/apiUrl";
import { useLoading } from "../context/LoadingContext";

const Blogs = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const { data } = await getArticles();
        if (data) {
          setArticles(data);

          // Extract categories from articles
          const uniqueCategories = [
            "All",
            ...new Set(data.map((article) => article.type || "Uncategorized")),
          ];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [setIsLoading]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredArticles =
    selectedCategory === "All"
      ? articles
      : articles.filter((article) => article.type === selectedCategory);

  return (
    <div className="min-h-screen pb-12 bg-gray-50">
      <div className="bg-gradient-to-r from-[#454545] to-[#333333] py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[#FFE6C7] text-center">
            DIY Blog Articles
          </h1>
          <p className="text-lg text-center text-[#FFE6C7]/80 mt-4 max-w-3xl mx-auto">
            Explore our collection of DIY projects, home improvement tips, and
            creative ideas for your next project
          </p>
        </div>
      </div>

      <div className="px-4 mx-auto mt-8 max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === category
                  ? "bg-[#FFA559] text-white shadow-md"
                  : "bg-white text-[#454545] border border-gray-200 hover:border-[#FFA559]"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <Link
                to={`/blogs/${article.id}`}
                key={article.id}
                className="overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-xl"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={`${apiUrl}${article.image}`}
                    alt={article.title}
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-0 right-0 bg-[#FFA559] text-white text-xs font-bold px-2 py-1 m-2 rounded">
                    {article.type || "DIY"}
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-bold text-[#454545] line-clamp-2 mb-2 hover:text-[#FFA559] transition-colors duration-200">
                    {article.title}
                  </h2>
                  <p className="mb-3 text-sm text-gray-500">
                    {formatDate(article.created_at)}
                  </p>
                  <p className="mb-4 text-gray-600 line-clamp-3">
                    {article.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#FFA559] font-medium text-sm inline-flex items-center">
                      Read more
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                    <span className="text-sm text-gray-500">
                      {article.comments.length}{" "}
                      {article.comments.length === 1 ? "comment" : "comments"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <h3 className="text-xl font-medium text-gray-600">
              No articles found in this category
            </h3>
            <p className="mt-2 text-gray-500">
              Try selecting a different category
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
