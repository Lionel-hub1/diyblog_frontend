import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import {
  createArticle,
  createType,
  getCurrentUser,
  getTypes,
  login,
  uploadEditorImage,
} from "../data/projectData";
import { stripRichText } from "../utils/richText";

const ADMIN_TOKEN_KEY = "diyblog_admin_token";

const initialLoginForm = {
  username: "",
  password: "",
};

const initialArticleForm = {
  title: "",
  type: "",
  customType: "",
  coverImage: null,
  content: "",
};

const Admin = () => {
  const quillRef = useRef(null);

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [token, setToken] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [types, setTypes] = useState([]);
  const [articleForm, setArticleForm] = useState(initialArticleForm);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const isAllowedAuthor = Boolean(
    currentUser &&
      (currentUser.is_author || currentUser.is_staff || currentUser.is_superuser)
  );

  const loadTypes = useCallback(async () => {
    try {
      const { data } = await getTypes();
      setTypes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load article types:", error);
      setTypes([]);
    }
  }, []);

  const loadAuthenticatedUser = useCallback(
    async (authToken) => {
      try {
        const { data } = await getCurrentUser(authToken);
        setCurrentUser(data);
        setToken(authToken);
        await loadTypes();
      } catch (error) {
        console.error("Failed to restore admin session:", error);
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        setCurrentUser(null);
        setToken("");
      }
    },
    [loadTypes]
  );

  useEffect(() => {
    document.title = "Admin Authoring | DIY Blog";
    const savedToken = localStorage.getItem(ADMIN_TOKEN_KEY);

    if (!savedToken) {
      setIsCheckingAuth(false);
      return;
    }

    loadAuthenticatedUser(savedToken).finally(() => {
      setIsCheckingAuth(false);
    });
  }, [loadAuthenticatedUser]);

  const handleLoginInputChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const { data } = await login(loginForm);
      localStorage.setItem(ADMIN_TOKEN_KEY, data.access);
      await loadAuthenticatedUser(data.access);
      setLoginForm(initialLoginForm);
    } catch (error) {
      console.error("Admin login failed:", error);
      setLoginError(
        "Login failed. Verify your credentials and ensure this account has author or staff permissions."
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setCurrentUser(null);
    setToken("");
    setLoginForm(initialLoginForm);
    setArticleForm(initialArticleForm);
    setFormError("");
    setFormSuccess("");
  };

  const handleArticleFieldChange = (event) => {
    const { name, value } = event.target;
    setArticleForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCoverImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setArticleForm((previous) => ({
      ...previous,
      coverImage: file,
    }));
  };

  const handleEditorImageUpload = useCallback(async () => {
    if (!token) {
      setFormError("Please login again to upload images.");
      return;
    }

    const picker = document.createElement("input");
    picker.setAttribute("type", "file");
    picker.setAttribute("accept", "image/*");
    picker.click();

    picker.onchange = async () => {
      const imageFile = picker.files?.[0];
      if (!imageFile) {
        return;
      }

      setFormError("");
      setIsUploadingImage(true);

      try {
        const { data } = await uploadEditorImage(imageFile, token);
        const editor = quillRef.current?.getEditor();
        if (!editor) {
          return;
        }

        const selection = editor.getSelection(true);
        const insertAt = selection ? selection.index : editor.getLength();
        editor.insertEmbed(insertAt, "image", data.url, "user");
        editor.setSelection(insertAt + 1);
      } catch (error) {
        console.error("Editor image upload failed:", error);
        setFormError("Image upload failed. Please try another image.");
      } finally {
        setIsUploadingImage(false);
      }
    };
  }, [token]);

  const editorModules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: handleEditorImageUpload,
        },
      },
    }),
    [handleEditorImageUpload]
  );

  const handlePublishArticle = async (event) => {
    event.preventDefault();
    setFormError("");
    setFormSuccess("");

    const title = articleForm.title.trim();
    const content = articleForm.content;
    const textPreview = stripRichText(content, 20);

    if (!title) {
      setFormError("Please provide a title for the article.");
      return;
    }

    if (!textPreview) {
      setFormError("Please add article content before publishing.");
      return;
    }

    if (!articleForm.coverImage) {
      setFormError("Please select a cover image for this article.");
      return;
    }

    setIsPublishing(true);

    try {
      let selectedTypeId = articleForm.type;
      if (articleForm.type === "__new__") {
        const customTypeName = articleForm.customType.trim();
        if (!customTypeName) {
          setFormError("Enter a new category name or choose an existing category.");
          setIsPublishing(false);
          return;
        }

        const { data: createdType } = await createType({ name: customTypeName }, token);
        selectedTypeId = createdType.id;
        await loadTypes();
      }

      const payload = new FormData();
      payload.append("title", title);
      payload.append("content", content);
      payload.append("image", articleForm.coverImage);
      if (selectedTypeId) {
        payload.append("type", selectedTypeId);
      }

      await createArticle(payload, token);
      setArticleForm(initialArticleForm);
      setFormSuccess("Article published successfully. It is now available on the blog.");
    } catch (error) {
      console.error("Article publish failed:", error);
      setFormError("Publishing failed. Please verify your session and try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f6f6]">
        <div className="flex items-center gap-3 text-[#454545]">
          <div className="w-8 h-8 border-4 border-[#FFA559] border-t-transparent rounded-full animate-spin" />
          <p className="font-semibold">Loading admin workspace...</p>
        </div>
      </div>
    );
  }

  if (!token || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#454545] via-[#3e3e3e] to-[#222222] px-4 py-14">
        <div className="max-w-md mx-auto bg-white/95 backdrop-blur shadow-2xl rounded-2xl p-8">
          <h1 className="text-3xl font-black text-[#454545]">Admin Login</h1>
          <p className="mt-2 text-sm text-gray-600">
            This page is only for authorized article authors.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleLoginSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={loginForm.username}
                onChange={handleLoginInputChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFA559]"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={loginForm.password}
                onChange={handleLoginInputChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFA559]"
                required
              />
            </div>

            {loginError ? (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {loginError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-[#FFA559] hover:bg-[#ff9233] text-white font-bold rounded-md px-4 py-2 transition-colors disabled:opacity-70"
            >
              {isLoggingIn ? "Signing in..." : "Sign in to Admin"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!isAllowedAuthor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7] px-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-8 max-w-lg text-center">
          <h2 className="text-2xl font-bold text-[#454545]">Permission required</h2>
          <p className="mt-3 text-gray-600">
            You are logged in, but this account is not marked as an author or staff user.
            Ask an administrator to grant author access.
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 px-5 py-2 rounded-md bg-[#454545] text-white hover:bg-[#333333]"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <header className="bg-[#454545] text-[#FFE6C7] px-4 md:px-8 py-5 shadow-lg sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-3 items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-black">Content Studio</h1>
            <p className="text-sm text-[#FFE6C7]/75 mt-1">
              Logged in as {currentUser.username}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 rounded-md bg-[#FFA559] text-white font-semibold hover:bg-[#ff9233] transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-bold text-[#454545]">Create New Article</h2>
          <p className="text-sm text-gray-500 mt-1">
            Use rich formatting, inline images, links, and color styles to craft high-quality content.
          </p>

          <form className="mt-6 space-y-6" onSubmit={handlePublishArticle}>
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={articleForm.title}
                onChange={handleArticleFieldChange}
                placeholder="Enter a compelling article title"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFA559]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="type"
                  name="type"
                  value={articleForm.type}
                  onChange={handleArticleFieldChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFA559]"
                >
                  <option value="">Uncategorized</option>
                  {types.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {entry.name}
                    </option>
                  ))}
                  <option value="__new__">Create a new category</option>
                </select>
              </div>

              {articleForm.type === "__new__" ? (
                <div>
                  <label htmlFor="customType" className="block text-sm font-semibold text-gray-700 mb-1">
                    New category name
                  </label>
                  <input
                    id="customType"
                    name="customType"
                    type="text"
                    value={articleForm.customType}
                    onChange={handleArticleFieldChange}
                    placeholder="Example: Interior Design"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFA559]"
                  />
                </div>
              ) : null}
            </div>

            <div>
              <label htmlFor="coverImage" className="block text-sm font-semibold text-gray-700 mb-1">
                Cover image
              </label>
              <input
                id="coverImage"
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                This image is used in article cards and the header section.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Article content
              </label>
              <div className="admin-quill-wrapper">
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={articleForm.content}
                  onChange={(value) =>
                    setArticleForm((previous) => ({
                      ...previous,
                      content: value,
                    }))
                  }
                  modules={editorModules}
                  placeholder="Write your article here..."
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Toolbar supports headings, color, alignment, links, and inline image insertion.
              </p>
            </div>

            {isUploadingImage ? (
              <p className="text-sm text-[#FFA559] font-medium">Uploading image into editor...</p>
            ) : null}

            {formError ? (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {formError}
              </p>
            ) : null}

            {formSuccess ? (
              <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
                {formSuccess}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isPublishing || isUploadingImage}
              className="px-6 py-3 rounded-md bg-[#FFA559] text-white font-bold hover:bg-[#ff9233] transition-colors disabled:opacity-70"
            >
              {isPublishing ? "Publishing..." : "Publish Article"}
            </button>
          </form>
        </section>

        <aside className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-fit lg:sticky lg:top-24">
          <h3 className="text-xl font-bold text-[#454545]">Live Preview</h3>
          <p className="text-sm text-gray-500 mt-1">This previews how the article content will read.</p>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Title</p>
              <p className="mt-1 text-lg font-bold text-[#454545]">
                {articleForm.title || "Untitled article"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Category</p>
              <p className="mt-1 text-sm text-gray-700">
                {articleForm.type === "__new__"
                  ? articleForm.customType || "New category"
                  : types.find((entry) => String(entry.id) === String(articleForm.type))?.name ||
                    "Uncategorized"}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase mb-2">
                Content excerpt
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {stripRichText(articleForm.content, 260) ||
                  "Start writing to preview your content here."}
              </p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Admin;
