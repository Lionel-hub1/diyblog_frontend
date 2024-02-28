import { useState } from "react";
import image1 from "../assets/images/fire-making.jpg";
import image2 from "../assets/images/lamp.jpg";
import image3 from "../assets/images/carpentry.jpg";
import { Link } from "react-router-dom";

const FilterTabs = () => {
  const [activeTab, setActiveTab] = useState("All");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const tabs = [
    { id: 1, name: "All" },
    { id: 2, name: "DIY" },
    { id: 3, name: "Home Improvement" },
    { id: 4, name: "Decor" },
    { id: 5, name: "Renovation" },
  ];

  const articlesList = [
    {
      id: 1,
      image: image1,
      title: "Article Title",
      date: "JANUARY 01, 2024",
      type: "DIY",
      comments: 5,
      introduction:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, repudiandae possimus! Quam deserunt perspiciatis sed modi recusandae porro, inventore ducimus maiores natus? Obcaecati amet, fuga ex minus cupiditate facilis aperiam.",
    },
    {
      id: 2,
      image: image2,
      title: "Article Title",
      date: "JANUARY 01, 2024",
      type: "Home Improvement",
      comments: 0,
      introduction:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, repudiandae possimus! Quam deserunt perspiciatis sed modi recusandae porro, inventore ducimus maiores natus? Obcaecati amet, fuga ex minus cupiditate facilis aperiam.",
    },
    {
      id: 3,
      image: image3,
      title: "Article Title",
      date: "JANUARY 01, 2024",
      type: "Decor",
      comments: 3,
      introduction:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, repudiandae possimus! Quam deserunt perspiciatis sed modi recusandae porro, inventore ducimus maiores natus? Obcaecati amet, fuga ex minus cupiditate facilis aperiam.",
    },
    {
      id: 4,
      image: image1,
      title: "Article Title",
      date: "JANUARY 01, 2024",
      type: "Renovation",
      comments: 2,
      introduction:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, repudiandae possimus! Quam deserunt perspiciatis sed modi recusandae porro, inventore ducimus maiores natus? Obcaecati amet, fuga ex minus cupiditate facilis aperiam.",
    },
    {
      id: 5,
      image: image2,
      title: "Article Title",
      date: "JANUARY 01, 2024",
      type: "DIY",
      comments: 1,
      introduction:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, repudiandae possimus! Quam deserunt perspiciatis sed modi recusandae porro, inventore ducimus maiores natus? Obcaecati amet, fuga ex minus cupiditate facilis aperiam.",
    },
    {
      id: 6,
      image: image3,
      title: "Article Title",
      date: "JANUARY 01, 2024",
      type: "Home Improvement",
      comments: 4,
      introduction:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, repudiandae possimus! Quam deserunt perspiciatis sed modi recusandae porro, inventore ducimus maiores natus? Obcaecati amet, fuga ex minus cupiditate facilis aperiam.",
    },
    {
      id: 7,
      image: image1,
      title: "Article Title",
      date: "JANUARY 01, 2024",
      type: "Decor",
      comments: 6,
      introduction:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, repudiandae possimus! Quam deserunt perspiciatis sed modi recusandae porro, inventore ducimus maiores natus? Obcaecati amet, fuga ex minus cupiditate facilis aperiam.",
    },
    {
      id: 8,
      image: image2,
      title: "Article Title",
      date: "JANUARY 01, 2024",
      type: "Renovation",
      comments: 7,
      introduction:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, repudiandae possimus! Quam deserunt perspiciatis sed modi recusandae porro, inventore ducimus maiores natus? Obcaecati amet, fuga ex minus cupiditate facilis aperiam.",
    },
    {
      id: 9,
      image: image3,
      title: "Article Title",
      date: "JANUARY 01, 2024",
      type: "DIY",
      comments: 8,
      introduction:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, repudiandae possimus! Quam deserunt perspiciatis sed modi recusandae porro, inventore ducimus maiores natus? Obcaecati amet, fuga ex minus cupiditate facilis aperiam.",
    },
    {
      id: 10,
      image: image1,
      title: "Article Title",
      date: "JANUARY 01, 2024",
      type: "Home Improvement",
      comments: 9,
      introduction:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, repudiandae possimus! Quam deserunt perspiciatis sed modi recusandae porro, inventore ducimus maiores natus? Obcaecati amet, fuga ex minus cupiditate facilis aperiam.",
    },
  ];

  const filteredArticles = articlesList.filter(
    (article) => activeTab === "All" || article.type === activeTab
  );

  return (
    <div className="flex flex-col">
      <div className="ml-24 mr-10 border-b-[2px] text-[#454545] mt-16 space-x-10 font-semibold">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.name)}
            className={`${
              activeTab === tab.name
                ? "border-[#FFA559] text-[#FFA559] transition duration-300 ease-in-out"
                : "border-transparent"
            } border-b-[2px] -mb-1 focus:outline-none uppercase`}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className="px-24 py-10">
        {filteredArticles.map((article, index) => (
          <div key={index} className="max-h-[15rem] shadow-md mb-8">
            <div className="flex">
              <img
                className="w-[15rem] h-[15rem] object-cover"
                src={article.image}
                alt=""
              />
              <div className="p-4">
                <h2 className="text-2xl font-bold line-clamp-1">
                  {article.title} {article.type}
                </h2>
                <p className="text-sm mt-2 line-clamp-1">{article.date}</p>
                <p className="mt-4 line-clamp-4">{article.introduction}</p>
                <div className="flex flex-row justify-between mt-2">
                  <Link
                    to={`/article/${article.id}`}
                    className="text-[#FFA559] font-semibold"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterTabs;
