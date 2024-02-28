import { useState } from "react";
import image1 from "../assets/images/fire-making.jpg";

const Article = () => {
  const [article, setArticle] = useState({
    id: 1,
    image: image1,
    title: "Article Title",
    date: "JANUARY 01, 2024",
    details: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ${"\n\n\n"}

            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    comments: [
      {
        id: 1,
        name: "Irumva Newman",
        date: "1/1/2024",
        comment: "Great article!",
      },
      {
        id: 3,
        name: "Sandra Uwase",
        date: "1/1/2024",
        comment: "This article is very helpful!",
      },
      {
        id: 2,
        name: "Denis Nsabimana",
        date: "1/1/2024",
        comment: "I love this article!",
      },
    ],
  });
  const [comments, setComments] = useState(article.comments);

  const [name, setName] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newComment = {
      id: article.comments.length + 1,
      name: name,
      date: new Date().toLocaleDateString(),
      comment: comment,
    };

    setArticle((prevArticle) => ({
      ...prevArticle,
      comments: [...prevArticle.comments, newComment],
    }));

    setComments((prevComments) => [...prevComments, newComment]);

    setName("");
    setComment("");
  };
  return (
    <div>
      <div className="px-24 py-10">
        <img
          className="h-[30rem] w-full object-cover"
          src={article.image}
          alt=""
        />
        <div className="mt-10">
          <h1 className="text-5xl font-bold">{article.title}</h1>
          <p className="text-sm mt-2">{article.date}</p>
          <p className="text-lg mt-5">{article.details}</p>
        </div>
      </div>
      <div className="flex flex-row px-24 py-10 space-x-4">
        <div className="w-1/2">
          <form className="" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-2">
              <input
                type="text"
                className="w-full px-4 py-2 rounded border-2 border-[#454545] focus:outline-none"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <textarea
                className="w-full p-4 rounded border-2 border-[#454545] focus:outline-none"
                placeholder="Enter your comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <button
                type="submit"
                className="w-full bg-[#454545] hover:bg-[#FFA559] hover:text-[#FFE6C7] font-semibold py-2 px-4 rounded focus:outline-none text-[#FFE6C7] transition duration-300 ease-in-out"
              >
                Add Comment
              </button>
            </div>
          </form>
        </div>
        <div className="w-1/2  px-4">
          <h1 className="text-3xl font-bold sticky top-0 bg-white">
            Comments ({comments.length})
          </h1>
          {comments ? (
            comments.map((comment, index) => (
              <div key={index} className="mt-5">
                <h2 className="text-xl font-semibold underline">
                  {comment.name}
                </h2>
                <p className="text-sm">
                  {new Date(comment.date)
                    .toLocaleDateString("en-US", {
                      month: "long",
                      day: "2-digit",
                      year: "numeric",
                    })
                    .toUpperCase()}
                </p>
                <p className="mt-2">{comment.comment}</p>
              </div>
            ))
          ) : (
            <p>No comments yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Article;
