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
  const openModal = (image) => {
    const modal = document.createElement("div");
    modal.classList.add("fixed", "top-0", "left-0", "w-full", "h-full", "bg-black", "bg-opacity-70", "z-50", "flex", "justify-center", "items-center");
    modal.innerHTML = `
    <div class="bg-white p-4 rounded-lg">
      <img src="${image}" alt="" class="w-auto max-h-[90vh] object-fill" />
      <button class="absolute top-4 right-4 bg-gray-800 text-white px-6 text-xl font-black py-2 rounded-md" onclick="this.parentElement.parentElement.remove()">Close</button>
    </div>
    `;
    document.body.appendChild(modal);
  }

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
          <div className="px-4 sm:px-14 lg:px-24 py-10">
            <div className="relative">
              <img
                className="h-[30rem] w-full object-cover"
                src={apiUrl + article.image}
                alt=""
              />
              <button
                className="absolute top-4 right-4 bg-gray-800 text-white font-black px-5 py-2 rounded-md"
                onClick={() => openModal(apiUrl + article.image)}
              >
                Preview
              </button>
            </div>
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
          <div className="flex flex-col md:flex-row px-4 sm:px-14 lg:px-24 py-10 space-x-4">
            <div className="w-full md:w-1/2">
              <h1 className="text-3xl font-bold mb-3">Leave a comment</h1>
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
        <p className="mt-16 h-[100vh] text-center flex justify-center space-x-5 text-[#FF6000]">
          <div className="w-6 h-6 border-2 border-[#FF6000] rounded-full animate-spin border-t-transparent"></div>{" "}
          <span>Loading...</span>
        </p>
      )}
    </div>
  );
};

export default Article;
