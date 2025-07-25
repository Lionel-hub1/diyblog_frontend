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
      <section className="w-full bg-[#454545] py-4 px-2 sm:px-6 md:px-10 lg:px-24 relative z-10">
        <div
          className="grid grid-cols-1 gap-6 -mb-10 md:grid-cols-2 md:gap-8 md:-mb-16"
          style={{ pointerEvents: "auto" }}
        >
          {articles.map((article, index) => (
            <Link
              key={index}
              to={`/blogs/${article.id}`}
              className={`group relative rounded-xl overflow-hidden border border-[#FFE6C7] shadow-lg transition-transform duration-300 hover:scale-[1.025] bg-[#232323] ${index === 0
                ? "md:row-span-2 md:h-[32rem] h-[20rem]"
                : "md:h-[15rem] h-[12rem]"
                }`}
              style={{
                minHeight: index === 0 ? undefined : "12rem",
              }}
            >
              <div className="w-full h-full">
                <img
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  src={`${apiUrl}${article.image}`}
                  alt={article.title}
                  style={{
                    aspectRatio: index === 0 ? "2/1" : "3/2",
                  }}
                />
                <div className="absolute inset-0 transition-opacity duration-300 pointer-events-none bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-3 sm:p-4 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
                  <h2 className="mb-1 font-bold text-white text-base sm:text-lg md:text-xl lg:text-2xl line-clamp-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                    {article.title}
                  </h2>
                  <div className="flex flex-wrap items-center text-[0.70rem] sm:text-xs md:text-sm text-[#FFE6C7] opacity-95 gap-x-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                    <span>{formatDate(article.created_at)}</span>
                    <span className="hidden sm:inline">|</span>
                    <span className="font-semibold tracking-wider uppercase">JEAN LIONEL</span>
                    <span className="hidden sm:inline">|</span>
                    <span>
                      {article.comments.length}{" "}
                      {article.comments.length === 1 ? "Comment" : "Comments"}
                    </span>
                  </div>
                  {article.comments.length === 0 && (
                    <p className="text-[0.70rem] sm:text-xs text-[#FFA559] mt-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                      No comments yet
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      {/* Add extra top margin to next section so overflow doesn't obstruct */}
      <div className="flex flex-col xl:flex-row w-full max-w-[1440px] mx-auto mt-10 md:mt-16">
        <FilterTabs />
        <Subscribe />
      </div>
    </>
  );
};

export default Home;
