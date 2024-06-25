import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getArticle,
  getArticleComments,
  postArticleComment,
} from "../data/projectData";
import apiUrl from "../constants/apiUrl";

const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState({});
  const [comments, setComments] = useState(article.comments);

  const [name, setName] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newComment = {
      article: id,
      author: name,
      content: comment,
    };
    const { data } = await postArticleComment(newComment);
    setComments([...comments, data]);
    setName("");
    setComment("");
  };

  useEffect(() => {
    const fetchArticle = async () => {
      const { data } = await getArticle(id);
      setArticle(data);
    };
    const getComments = async () => {
      const { data } = await getArticleComments(id);
      setComments(data);
    };

    fetchArticle();
    getComments();
  }, [id]);

  return (
    <div>
      {article && article.author ? (
        <>
          <div className="px-24 py-10">
            <img
              className="h-[30rem] w-full object-cover"
              src={apiUrl + article.image}
              alt=""
            />
            <div className="mt-10">
              <h1 className="text-5xl font-bold">{article.title}</h1>
              <p className="text-sm mt-2">
                {new Date(article.created_at)
                  .toLocaleDateString("en-US", {
                    month: "long",
                    day: "2-digit",
                    year: "numeric",
                  })
                  .toUpperCase()}
              </p>
              <p className="text-lg mt-5">{article.content}</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row px-24 py-10 space-x-4">
            <div className="w-full md:w-1/2">
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
            <div className="w-full md:w-1/2  md:px-4">
              <h1 className="text-3xl font-bold sticky top-0 bg-white">
                Comments ({comments && comments.length})
              </h1>
              {comments && comments.length !== 0 ? (
                comments.map((comment, index) => (
                  <div key={index} className="mt-5">
                    <h2 className="text-xl font-semibold underline">
                      {comment.author}
                    </h2>
                    <p className="text-sm">
                      {new Date(comment.created_at)
                        .toLocaleDateString("en-US", {
                          month: "long",
                          day: "2-digit",
                          year: "numeric",
                        })
                        .toUpperCase()}
                    </p>
                    <p className="mt-2">{comment.content}</p>
                  </div>
                ))
              ) : (
                <p className="mt-5">No comments yet</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <p className="mt-16 text-center text-[#FF6000]">Loading...</p>
      )}
    </div>
  );
};

export default Article;
