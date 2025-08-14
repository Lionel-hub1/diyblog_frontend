import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import FilterTabs from "../components/Filter_tabs";
import Subscribe from "../components/Subscribe";
import { getArticles } from "../data/projectData";
import apiUrl from "../constants/apiUrl";
import { useLoading } from "../context/LoadingContext";

const Home = () => {
  const [articles, setArticles] = useState([]);
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      try {
        const { data } = await getArticles();
        if (data) {
          setArticles(data.slice(0, 3));
        } else {
          console.log("No data Found");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [setIsLoading]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <section className="w-full bg-gradient-to-b from-[#454545] to-[#353535] py-8 px-4 sm:px-6 md:px-10 lg:px-24 relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold text-[#FFE6C7] mb-6 text-center">
          Featured Articles
        </h1>
        <div
          className="grid grid-cols-1 gap-8 mx-auto -mb-10 md:grid-cols-2 md:gap-10 md:-mb-16 max-w-7xl"
          style={{ pointerEvents: "auto" }}
        >
          {articles.map((article, index) => (
            <Link
              key={index}
              to={`/blogs/${article.id}`}
              className={`group relative rounded-xl overflow-hidden border border-[#FFE6C7] shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-[#232323] ${index === 0
                  ? "md:row-span-2 md:h-[32rem] h-[20rem]"
                  : "md:h-[15rem] h-[12rem]"
                }`}
              style={{
                minHeight: index === 0 ? undefined : "12rem",
              }}
            >
              <div className="w-full h-full">
                <img
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  src={`${apiUrl}${article.image}`}
                  alt={article.title}
                  style={{
                    aspectRatio: index === 0 ? "2/1" : "3/2",
                  }}
                />
                <div className="absolute inset-0 transition-opacity duration-300 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-70" />
                <div className="absolute bottom-0 left-0 w-full p-4 transition-transform duration-300 transform translate-y-2 sm:p-5 bg-gradient-to-t from-black/80 via-black/50 to-transparent group-hover:translate-y-0">
                  <h2 className="mb-2 font-bold text-white text-base sm:text-xl md:text-2xl lg:text-2xl line-clamp-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                    {article.title}
                  </h2>
                  <div className="flex flex-wrap items-center text-[0.75rem] sm:text-sm md:text-sm text-[#FFE6C7] opacity-90 gap-x-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                    <span className="bg-[#FFA559]/30 px-2 py-1 rounded-full">
                      {formatDate(article.created_at)}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="font-semibold tracking-wider uppercase">
                      JEAN LIONEL
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="bg-[#454545]/50 px-2 py-1 rounded-full">
                      {article.comments.length}{" "}
                      {article.comments.length === 1 ? "Comment" : "Comments"}
                    </span>
                  </div>
                  {article.comments.length === 0 && (
                    <p className="text-[0.70rem] sm:text-xs text-[#FFA559] mt-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                      Be the first to comment
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <div className="flex flex-col xl:flex-row w-full max-w-[1440px] mx-auto mt-12 md:mt-20">
        <FilterTabs />
        <Subscribe />
      </div>
    </>
  );
};

export default Home;
