import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getArticle,
  getArticleComments,
  postArticleComment,
} from "../data/projectData";
import apiUrl from "../constants/apiUrl";
import { useLoading } from "../context/LoadingContext";

const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState({});
  const [comments, setComments] = useState([]);
  const [relatedArticles, setRelatedArticles] = useState([]);

  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);

  const { setIsLoading } = useLoading();

  const openModal = (image) => {
    const modal = document.createElement("div");
    modal.classList.add("fixed", "top-0", "left-0", "w-full", "h-full", "bg-black", "bg-opacity-90", "z-50", "flex", "justify-center", "items-center");
    modal.onclick = () => modal.remove();
    modal.innerHTML = `
    <div class="bg-white rounded-lg overflow-hidden max-w-4xl mx-4" onclick="event.stopPropagation()">
      <div class="relative">
        <img src="${image}" alt="" class="w-auto max-h-[90vh] object-contain" />
        <button class="absolute top-4 right-4 bg-gray-800 text-white px-6 text-xl font-black py-2 rounded-md hover:bg-gray-700 transition-colors" onclick="this.parentElement.parentElement.parentElement.remove()">Close</button>
      </div>
    </div>
    `;
    document.body.appendChild(modal);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setIsSubmitting(true);
    try {
      const newComment = {
        article: id,
        author: name,
        content: comment,
      };
      const { data } = await postArticleComment(newComment);
      setComments([...comments, data]);
      setName("");
      setComment("");
      setCommentSuccess(true);
      setTimeout(() => setCommentSuccess(false), 3000);
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchArticleData = async () => {
      setIsLoading(true);
      try {
        const { data } = await getArticle(id);
        setArticle(data);
        document.title = `${data.title} - DIY Blog`;

        // Get comments
        const commentsResponse = await getArticleComments(id);
        setComments(commentsResponse.data);

        // Simulated related articles (in a real app, you'd fetch related content)
        setRelatedArticles([
          { id: Math.floor(Math.random() * 100), title: "10 Weekend DIY Projects Anyone Can Do", image: data.image },
          { id: Math.floor(Math.random() * 100), title: "Essential Tools Every DIY Enthusiast Should Own", image: data.image },
        ]);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticleData();
    // Scroll to top when article changes
    window.scrollTo(0, 0);
  }, [id, setIsLoading]);

  if (!article || !article.author) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-4 text-[#FFA559]">
          <div className="w-8 h-8 border-4 border-[#FFA559] rounded-full border-t-transparent animate-spin"></div>
          <span className="text-xl font-medium">Loading article...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="relative h-[40vh] md:h-[60vh] overflow-hidden bg-[#454545]">
        <img
          src={apiUrl + article.image}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#454545]/80 to-[#454545]/90"></div>

        <div className="relative h-full max-w-5xl mx-auto px-4 flex flex-col justify-center">
          <h1 className="text-3xl md:text-5xl font-bold text-[#FFE6C7] leading-tight">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center mt-6 text-[#FFE6C7]/80 space-x-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(article.created_at)}</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium">{article.author}</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <span>{comments.length} Comments</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <div className="relative mb-8 rounded-lg overflow-hidden">
                <img
                  className="w-full h-auto object-cover"
                  src={apiUrl + article.image}
                  alt={article.title}
                />
                <button
                  className="absolute top-4 right-4 bg-gray-800/70 hover:bg-gray-800 text-white font-medium px-4 py-2 rounded-md transition-colors"
                  onClick={() => openModal(apiUrl + article.image)}
                >
                  View Full Image
                </button>
              </div>

              <div className="prose max-w-none">
                <p className="text-lg leading-relaxed whitespace-pre-line">{article.content}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-[#454545] mb-6">Leave a Comment</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#FFA559] focus:border-transparent"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                    <textarea
                      id="comment"
                      rows="4"
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#FFA559] focus:border-transparent"
                      placeholder="Share your thoughts..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2 bg-[#FFA559] text-white font-medium rounded-md hover:bg-[#ff9233] transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                  </button>

                  {commentSuccess && (
                    <div className="mt-2 p-2 bg-green-100 text-green-700 rounded-md">
                      Comment posted successfully!
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#454545] mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#FFA559]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Comments ({comments.length})
              </h2>

              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                {comments.length > 0 ? comments.map((comment, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center mb-2">
                      <div className="bg-[#FFA559]/20 text-[#FFA559] font-bold rounded-full w-8 h-8 flex items-center justify-center">
                        {comment.author.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium">{comment.author}</h3>
                        <p className="text-xs text-gray-500">{formatDate(comment.created_at)}</p>
                      </div>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                )) : (
                  <p className="text-gray-500 italic">No comments yet. Be the first to comment!</p>
                )}
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-bold text-[#454545] mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#FFA559]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Related Articles
                </h2>

                <div className="space-y-4">
                  {relatedArticles.map((relArticle, index) => (
                    <Link to={`/blogs/${relArticle.id}`} key={index} className="block">
                      <div className="flex items-center space-x-3 group">
                        <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                          <img src={apiUrl + relArticle.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium text-gray-800 group-hover:text-[#FFA559] transition-colors">
                            {relArticle.title}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
