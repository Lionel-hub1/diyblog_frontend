import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "tinymce/tinymce";
import "tinymce/icons/default";
import "tinymce/themes/silver";
import "tinymce/models/dom";
import "tinymce/plugins/advlist";
import "tinymce/plugins/autolink";
import "tinymce/plugins/lists";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/charmap";
import "tinymce/plugins/preview";
import "tinymce/plugins/anchor";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/code";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/media";
import "tinymce/plugins/table";
import "tinymce/plugins/help";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/codesample";
import "tinymce/plugins/quickbars";
import "tinymce/skins/ui/oxide/skin.min.css";
import "tinymce/skins/content/default/content.min.css";

import apiUrl from "../constants/apiUrl";
import {
    createArticle,
    createType,
    deleteArticle,
    deleteComment,
    deleteType,
    getArticle,
    getArticles,
    getCurrentUser,
    getTypes,
    login,
    updateArticle,
    updateType,
    uploadEditorImage,
} from "../data/projectData";
import { stripRichText } from "../utils/richText";

const ADMIN_TOKEN_KEY = "diyblog_admin_token";

const initialLoginForm = {
    username: "",
    password: "",
};

const buildInitialArticleForm = () => ({
    title: "",
    type: "",
    customType: "",
    coverImage: null,
    existingImage: "",
    content: "",
    editingArticleId: null,
});

const dashboardSections = [
    { id: "overview", label: "Overview" },
    { id: "editor", label: "Editor" },
    { id: "articles", label: "Articles" },
    { id: "categories", label: "Categories" },
    { id: "comments", label: "Comments" },
];

const formatDate = (value) => {
    if (!value) {
        return "-";
    }

    return new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
};

const getErrorMessage = (error, fallbackMessage) => {
    const responseData = error?.response?.data;

    if (typeof responseData === "string" && responseData.trim()) {
        return responseData;
    }

    if (responseData?.detail) {
        return responseData.detail;
    }

    if (responseData && typeof responseData === "object") {
        const firstKey = Object.keys(responseData)[0];
        const value = responseData[firstKey];
        if (Array.isArray(value) && value.length > 0) {
            return String(value[0]);
        }
        if (typeof value === "string") {
            return value;
        }
    }

    return fallbackMessage;
};

const Admin = () => {
    const editorRef = useRef(null);

    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isRefreshingData, setIsRefreshingData] = useState(false);

    const [token, setToken] = useState("");
    const [currentUser, setCurrentUser] = useState(null);

    const [loginForm, setLoginForm] = useState(initialLoginForm);
    const [loginError, setLoginError] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [types, setTypes] = useState([]);
    const [articles, setArticles] = useState([]);

    const [activeSection, setActiveSection] = useState("overview");
    const [searchQuery, setSearchQuery] = useState("");

    const [articleForm, setArticleForm] = useState(buildInitialArticleForm);
    const [isSavingArticle, setIsSavingArticle] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const [newCategoryName, setNewCategoryName] = useState("");
    const [typeDrafts, setTypeDrafts] = useState({});
    const [isSavingCategory, setIsSavingCategory] = useState(false);

    const [dashboardError, setDashboardError] = useState("");
    const [dashboardSuccess, setDashboardSuccess] = useState("");

    const [coverPreviewUrl, setCoverPreviewUrl] = useState("");

    const isAllowedAuthor = Boolean(
        currentUser &&
        (currentUser.is_author || currentUser.is_staff || currentUser.is_superuser)
    );

    const clearNotices = useCallback(() => {
        setDashboardError("");
        setDashboardSuccess("");
    }, []);

    const loadTypes = useCallback(async () => {
        const { data } = await getTypes();
        const resolvedTypes = Array.isArray(data) ? data : [];
        setTypes(resolvedTypes);

        setTypeDrafts((previous) => {
            const next = {};
            resolvedTypes.forEach((entry) => {
                next[entry.id] = previous[entry.id] ?? entry.name;
            });
            return next;
        });
    }, []);

    const loadArticles = useCallback(async () => {
        const { data } = await getArticles();
        setArticles(Array.isArray(data) ? data : []);
    }, []);

    const refreshDashboardData = useCallback(async () => {
        setIsRefreshingData(true);
        try {
            await Promise.all([loadTypes(), loadArticles()]);
        } finally {
            setIsRefreshingData(false);
        }
    }, [loadTypes, loadArticles]);

    const loadAuthenticatedUser = useCallback(
        async (authToken, { silent = false } = {}) => {
            try {
                const { data } = await getCurrentUser(authToken);
                setCurrentUser(data);
                setToken(authToken);
                await refreshDashboardData();
            } catch (error) {
                localStorage.removeItem(ADMIN_TOKEN_KEY);
                setCurrentUser(null);
                setToken("");
                if (!silent) {
                    throw error;
                }
            }
        },
        [refreshDashboardData]
    );

    useEffect(() => {
        document.title = "Admin Dashboard | DIY Blog";
        const savedToken = localStorage.getItem(ADMIN_TOKEN_KEY);

        if (!savedToken) {
            setIsCheckingAuth(false);
            return;
        }

        loadAuthenticatedUser(savedToken, { silent: true }).finally(() => {
            setIsCheckingAuth(false);
        });
    }, [loadAuthenticatedUser]);

    useEffect(() => {
        if (articleForm.coverImage) {
            const objectUrl = URL.createObjectURL(articleForm.coverImage);
            setCoverPreviewUrl(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }

        setCoverPreviewUrl(articleForm.existingImage || "");
        return undefined;
    }, [articleForm.coverImage, articleForm.existingImage]);

    const articleCountByTypeName = useMemo(() => {
        const result = {};
        articles.forEach((entry) => {
            const label = entry.type || "Uncategorized";
            result[label] = (result[label] || 0) + 1;
        });
        return result;
    }, [articles]);

    const flattenedComments = useMemo(() => {
        const rows = [];

        articles.forEach((article) => {
            const comments = Array.isArray(article.comments) ? article.comments : [];
            comments.forEach((comment) => {
                rows.push({
                    ...comment,
                    articleId: article.id,
                    articleTitle: article.title,
                });
            });
        });

        return rows.sort(
            (left, right) =>
                new Date(right.created_at || 0).getTime() -
                new Date(left.created_at || 0).getTime()
        );
    }, [articles]);

    const metrics = useMemo(() => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const articlesThisMonth = articles.filter((entry) => {
            const published = new Date(entry.created_at || 0);
            return (
                published.getMonth() === currentMonth &&
                published.getFullYear() === currentYear
            );
        }).length;

        return [
            {
                title: "Total Articles",
                value: articles.length,
                detail: `${articlesThisMonth} published this month`,
            },
            {
                title: "Categories",
                value: types.length,
                detail: "Manage taxonomy and structure",
            },
            {
                title: "Comments",
                value: flattenedComments.length,
                detail: "Moderate community activity",
            },
        ];
    }, [articles, flattenedComments.length, types.length]);

    const filteredArticles = useMemo(() => {
        const normalizedSearch = searchQuery.trim().toLowerCase();

        if (!normalizedSearch) {
            return articles;
        }

        return articles.filter((entry) => {
            const titleMatch = entry.title?.toLowerCase().includes(normalizedSearch);
            const typeMatch = String(entry.type || "")
                .toLowerCase()
                .includes(normalizedSearch);
            const authorMatch = String(entry.author || "")
                .toLowerCase()
                .includes(normalizedSearch);
            return titleMatch || typeMatch || authorMatch;
        });
    }, [articles, searchQuery]);

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
            clearNotices();
        } catch (error) {
            setLoginError(
                getErrorMessage(
                    error,
                    "Login failed. Verify your credentials and ensure this account has author or staff permissions."
                )
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
        setArticleForm(buildInitialArticleForm());
        setNewCategoryName("");
        setDashboardError("");
        setDashboardSuccess("");
    };

    const openCreateArticlePanel = () => {
        clearNotices();
        setArticleForm(buildInitialArticleForm());
        setActiveSection("editor");
    };

    const handleArticleFieldChange = (event) => {
        const { name, value } = event.target;
        setArticleForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleCoverImageChange = (event) => {
        const selectedFile = event.target.files?.[0] || null;
        setArticleForm((previous) => ({
            ...previous,
            coverImage: selectedFile,
        }));
    };

    const handleEditArticle = async (articleId) => {
        clearNotices();
        setIsRefreshingData(true);

        try {
            const { data } = await getArticle(articleId);
            const existingImage = data?.image
                ? `${apiUrl}${data.image}`
                : "";

            setArticleForm({
                title: data?.title || "",
                type: data?.type ? String(data.type) : "",
                customType: "",
                coverImage: null,
                existingImage,
                content: data?.content || "",
                editingArticleId: data?.id || articleId,
            });
            setActiveSection("editor");
            setDashboardSuccess("Editing article. Save when your updates are ready.");
        } catch (error) {
            setDashboardError(
                getErrorMessage(error, "Failed to load article details for editing.")
            );
        } finally {
            setIsRefreshingData(false);
        }
    };

    const handleArticleSubmit = async (event) => {
        event.preventDefault();
        clearNotices();

        const title = articleForm.title.trim();
        const content = articleForm.content;
        const plainTextPreview = stripRichText(content, 20);

        if (!title) {
            setDashboardError("Please enter a title for the article.");
            return;
        }

        if (!plainTextPreview) {
            setDashboardError("Please add meaningful article content before saving.");
            return;
        }

        const isEditing = Boolean(articleForm.editingArticleId);
        if (!isEditing && !articleForm.coverImage) {
            setDashboardError("Please choose a cover image before publishing.");
            return;
        }

        setIsSavingArticle(true);

        try {
            let selectedTypeId = articleForm.type;
            if (articleForm.type === "__new__") {
                const nextTypeName = articleForm.customType.trim();
                if (!nextTypeName) {
                    setDashboardError(
                        "Provide a category name, or choose an existing category."
                    );
                    setIsSavingArticle(false);
                    return;
                }

                const { data: createdType } = await createType(
                    { name: nextTypeName },
                    token
                );
                selectedTypeId = createdType.id;
            }

            const payload = new FormData();
            payload.append("title", title);
            payload.append("content", content);
            if (selectedTypeId) {
                payload.append("type", selectedTypeId);
            }
            if (articleForm.coverImage) {
                payload.append("image", articleForm.coverImage);
            }

            if (isEditing) {
                await updateArticle(articleForm.editingArticleId, payload, token);
                setDashboardSuccess("Article updated successfully.");
            } else {
                await createArticle(payload, token);
                setDashboardSuccess("Article published successfully.");
            }

            await refreshDashboardData();
            setArticleForm(buildInitialArticleForm());
            setActiveSection("articles");
        } catch (error) {
            setDashboardError(
                getErrorMessage(error, "Saving article failed. Please try again.")
            );
        } finally {
            setIsSavingArticle(false);
        }
    };

    const handleDeleteArticle = async (articleId) => {
        const shouldDelete = window.confirm(
            "Delete this article permanently? This action cannot be undone."
        );
        if (!shouldDelete) {
            return;
        }

        clearNotices();

        try {
            await deleteArticle(articleId, token);
            if (articleForm.editingArticleId === articleId) {
                setArticleForm(buildInitialArticleForm());
            }
            await refreshDashboardData();
            setDashboardSuccess("Article deleted successfully.");
        } catch (error) {
            setDashboardError(
                getErrorMessage(error, "Unable to delete the selected article.")
            );
        }
    };

    const handleCreateCategory = async (event) => {
        event.preventDefault();
        const normalized = newCategoryName.trim();
        if (!normalized) {
            return;
        }

        clearNotices();
        setIsSavingCategory(true);

        try {
            await createType({ name: normalized }, token);
            setNewCategoryName("");
            await refreshDashboardData();
            setDashboardSuccess("Category created successfully.");
        } catch (error) {
            setDashboardError(
                getErrorMessage(error, "Failed to create the category.")
            );
        } finally {
            setIsSavingCategory(false);
        }
    };

    const handleRenameCategory = async (typeId) => {
        const nextName = String(typeDrafts[typeId] || "").trim();
        if (!nextName) {
            return;
        }

        clearNotices();

        try {
            await updateType(typeId, { name: nextName }, token);
            await refreshDashboardData();
            setDashboardSuccess("Category name updated.");
        } catch (error) {
            setDashboardError(
                getErrorMessage(error, "Failed to update this category.")
            );
        }
    };

    const handleDeleteCategory = async (typeId) => {
        const shouldDelete = window.confirm(
            "Delete this category? It can only be deleted when no article uses it."
        );
        if (!shouldDelete) {
            return;
        }

        clearNotices();

        try {
            await deleteType(typeId, token);
            await refreshDashboardData();
            setDashboardSuccess("Category deleted.");
        } catch (error) {
            setDashboardError(
                getErrorMessage(
                    error,
                    "Unable to delete category. Remove or move linked articles first."
                )
            );
        }
    };

    const handleDeleteComment = async (commentId) => {
        const shouldDelete = window.confirm("Delete this comment permanently?");
        if (!shouldDelete) {
            return;
        }

        clearNotices();

        try {
            await deleteComment(commentId, token);
            await refreshDashboardData();
            setDashboardSuccess("Comment deleted successfully.");
        } catch (error) {
            setDashboardError(
                getErrorMessage(error, "Failed to delete the selected comment.")
            );
        }
    };

    const sectionMeta = useMemo(
        () => ({
            overview: `${metrics[0]?.value || 0}`,
            editor: articleForm.editingArticleId ? "Edit" : "New",
            articles: `${articles.length}`,
            categories: `${types.length}`,
            comments: `${flattenedComments.length}`,
        }),
        [articleForm.editingArticleId, articles.length, flattenedComments.length, metrics, types.length]
    );

    const editorInit = useMemo(
        () => ({
            height: 560,
            menubar: "file edit view insert format tools table help",
            toolbar_sticky: true,
            toolbar_sticky_offset: 84,
            plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "help",
                "wordcount",
                "codesample",
                "quickbars",
            ],
            toolbar:
                "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image table media | removeformat | code fullscreen",
            block_formats:
                "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Blockquote=blockquote; Code Block=pre",
            font_family_formats:
                "Merriweather=Merriweather,Georgia,serif; Manrope=Manrope,Helvetica,sans-serif; Lora=Lora,serif; Nunito Sans=\"Nunito Sans\",sans-serif",
            image_title: true,
            image_caption: true,
            image_advtab: true,
            image_dimensions: true,
            object_resizing: "img",
            automatic_uploads: true,
            quickbars_selection_toolbar:
                "bold italic underline | blocks | quicklink blockquote",
            quickbars_insert_toolbar: "image media table",
            image_class_list: [
                { title: "Responsive image", value: "image-responsive" },
                { title: "Wrap text left", value: "image-wrap-left" },
                { title: "Wrap text right", value: "image-wrap-right" },
                { title: "Centered image", value: "image-center" },
            ],
            style_formats: [
                {
                    title: "Image Width",
                    items: [
                        {
                            title: "Small image",
                            selector: "img",
                            styles: { width: "30%", height: "auto" },
                        },
                        {
                            title: "Medium image",
                            selector: "img",
                            styles: { width: "50%", height: "auto" },
                        },
                        {
                            title: "Large image",
                            selector: "img",
                            styles: { width: "70%", height: "auto" },
                        },
                        {
                            title: "Full width",
                            selector: "img",
                            styles: { width: "100%", height: "auto" },
                        },
                    ],
                },
            ],
            content_style: `
                body {
                    font-family: "Merriweather", Georgia, serif;
                    font-size: 17px;
                    line-height: 1.75;
                    color: #2b2b2b;
                    margin: 1rem;
                }
                img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 12px;
                }
                img.image-wrap-left {
                    float: left;
                    margin: 0.4rem 1rem 0.9rem 0;
                    width: min(45%, 360px);
                }
                img.image-wrap-right {
                    float: right;
                    margin: 0.4rem 0 0.9rem 1rem;
                    width: min(45%, 360px);
                }
                img.image-center {
                    display: block;
                    margin: 1rem auto;
                }
                img.image-responsive {
                    display: block;
                    margin: 1rem auto;
                    width: 100%;
                    max-width: 100%;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 1rem 0;
                }
                table td,
                table th {
                    border: 1px solid #e2e8f0;
                    padding: 0.6rem;
                }
                @media (max-width: 768px) {
                    img.image-wrap-left,
                    img.image-wrap-right {
                        float: none;
                        width: 100%;
                        margin: 0.9rem 0;
                    }
                }
            `,
            images_upload_handler: async (blobInfo) => {
                if (!token) {
                    throw new Error("Please sign in again before uploading images.");
                }

                setIsUploadingImage(true);

                try {
                    const { data } = await uploadEditorImage(blobInfo.blob(), token);
                    return data.url;
                } catch (error) {
                    throw new Error(
                        getErrorMessage(error, "Image upload failed. Please try another file.")
                    );
                } finally {
                    setIsUploadingImage(false);
                }
            },
            branding: false,
            promotion: false,
            resize: true,
            statusbar: true,
        }),
        [token]
    );

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f3efe9]">
                <div className="admin-loading-card">
                    <div className="admin-loading-spinner" />
                    <p className="font-semibold text-[#4a443f]">Loading editorial workspace...</p>
                </div>
            </div>
        );
    }

    if (!token || !currentUser) {
        return (
            <div className="min-h-screen admin-login-bg px-4 py-14">
                <div className="max-w-md mx-auto admin-login-card">
                    <p className="admin-eyebrow">DIY Blog Content Studio</p>
                    <h1 className="text-3xl font-black text-[#3c3732]">Admin Sign In</h1>
                    <p className="mt-2 text-sm text-[#615b55]">
                        Secure access for authors, editors, and administrators.
                    </p>

                    <form className="mt-8 space-y-4" onSubmit={handleLoginSubmit}>
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-semibold text-[#4c4742] mb-1"
                            >
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                value={loginForm.username}
                                onChange={handleLoginInputChange}
                                className="admin-input"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold text-[#4c4742] mb-1"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                value={loginForm.password}
                                onChange={handleLoginInputChange}
                                className="admin-input"
                                required
                            />
                        </div>

                        {loginError ? (
                            <p className="admin-notice admin-notice-error">{loginError}</p>
                        ) : null}

                        <button
                            type="submit"
                            disabled={isLoggingIn}
                            className="admin-primary-btn w-full"
                        >
                            {isLoggingIn ? "Signing in..." : "Open Dashboard"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (!isAllowedAuthor) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f7f5f2] px-4">
                <div className="admin-panel max-w-xl text-center p-8">
                    <h2 className="text-2xl font-black text-[#3f3934]">Permission required</h2>
                    <p className="mt-3 text-[#655f58]">
                        This account is authenticated but not authorized for editorial access.
                        Ask an administrator to grant author or staff permissions.
                    </p>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="admin-secondary-btn mt-6"
                    >
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen admin-dashboard-bg admin-dashboard-root">
            <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-6 md:py-8">
                <header className="admin-topbar">
                    <div>
                        <p className="admin-eyebrow">Editorial Dashboard</p>
                        <h1 className="text-2xl md:text-3xl font-black text-[#2f2a26]">
                            Content Studio
                        </h1>
                        <p className="mt-1 text-sm text-[#5f5953]">
                            Logged in as <strong>{currentUser.username}</strong>
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => refreshDashboardData()}
                            className="admin-secondary-btn"
                            disabled={isRefreshingData}
                        >
                            {isRefreshingData ? "Refreshing..." : "Refresh"}
                        </button>
                        <button
                            type="button"
                            onClick={openCreateArticlePanel}
                            className="admin-primary-btn"
                        >
                            New Article
                        </button>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="admin-ghost-btn"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                    <aside className="lg:col-span-3">
                        <div className="admin-panel p-3 md:p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-[#7a746d] font-semibold px-1 mb-3">
                                Workspace
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
                                {dashboardSections.map((section) => (
                                    <button
                                        key={section.id}
                                        type="button"
                                        onClick={() => {
                                            clearNotices();
                                            setActiveSection(section.id);
                                        }}
                                        className={`admin-nav-btn ${activeSection === section.id ? "admin-nav-btn-active" : ""
                                            }`}
                                    >
                                        <span>{section.label}</span>
                                        <span className="admin-nav-pill">{sectionMeta[section.id]}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    <main className="lg:col-span-9 space-y-4">
                        {dashboardError ? (
                            <p className="admin-notice admin-notice-error">{dashboardError}</p>
                        ) : null}

                        {dashboardSuccess ? (
                            <p className="admin-notice admin-notice-success">{dashboardSuccess}</p>
                        ) : null}

                        {activeSection === "overview" ? (
                            <section className="space-y-4">
                                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {metrics.map((card) => (
                                        <article key={card.title} className="admin-stat-card">
                                            <p className="text-xs uppercase tracking-[0.16em] text-[#7a746d]">
                                                {card.title}
                                            </p>
                                            <p className="text-3xl mt-2 font-black text-[#2f2a26]">
                                                {card.value}
                                            </p>
                                            <p className="mt-2 text-sm text-[#605a54]">{card.detail}</p>
                                        </article>
                                    ))}
                                </div>

                                <div className="admin-panel p-5 md:p-6">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <h2 className="text-xl font-black text-[#3a3530]">
                                            Recent Articles
                                        </h2>
                                        <button
                                            type="button"
                                            onClick={() => setActiveSection("articles")}
                                            className="admin-link-btn"
                                        >
                                            Manage all articles
                                        </button>
                                    </div>

                                    <div className="mt-4 space-y-3">
                                        {articles.slice(0, 5).map((article) => (
                                            <div key={article.id} className="admin-row-card">
                                                <div>
                                                    <p className="font-semibold text-[#35302c]">{article.title}</p>
                                                    <p className="text-sm text-[#67605a] mt-1">
                                                        {article.type || "Uncategorized"} • {formatDate(article.created_at)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditArticle(article.id)}
                                                        className="admin-outline-btn"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteArticle(article.id)}
                                                        className="admin-danger-btn"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {articles.length === 0 ? (
                                            <p className="text-sm text-[#6b655e]">
                                                No article published yet. Start by creating your first one.
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            </section>
                        ) : null}

                        {activeSection === "editor" ? (
                            <section className="admin-panel p-5 md:p-6">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-black text-[#332e2a]">
                                            {articleForm.editingArticleId
                                                ? "Edit Article"
                                                : "Create New Article"}
                                        </h2>
                                        <p className="text-sm text-[#67615b] mt-1">
                                            Microsoft Word-style writing workflow with table, media, and image wrap controls.
                                        </p>
                                    </div>
                                    {articleForm.editingArticleId ? (
                                        <button
                                            type="button"
                                            onClick={openCreateArticlePanel}
                                            className="admin-secondary-btn"
                                        >
                                            Switch to new article
                                        </button>
                                    ) : null}
                                </div>

                                <form className="mt-6 space-y-6" onSubmit={handleArticleSubmit}>
                                    <div>
                                        <label htmlFor="title" className="admin-label">
                                            Article title
                                        </label>
                                        <input
                                            id="title"
                                            name="title"
                                            type="text"
                                            value={articleForm.title}
                                            onChange={handleArticleFieldChange}
                                            placeholder="Enter a compelling article title"
                                            className="admin-input"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="type" className="admin-label">
                                                Category
                                            </label>
                                            <select
                                                id="type"
                                                name="type"
                                                value={articleForm.type}
                                                onChange={handleArticleFieldChange}
                                                className="admin-input"
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
                                                <label htmlFor="customType" className="admin-label">
                                                    New category name
                                                </label>
                                                <input
                                                    id="customType"
                                                    name="customType"
                                                    type="text"
                                                    value={articleForm.customType}
                                                    onChange={handleArticleFieldChange}
                                                    placeholder="Example: Interior Design"
                                                    className="admin-input"
                                                />
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                        <div>
                                            <label htmlFor="coverImage" className="admin-label">
                                                Cover image
                                            </label>
                                            <input
                                                id="coverImage"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleCoverImageChange}
                                                className="admin-input-file"
                                            />
                                            <p className="text-xs text-[#7a746d] mt-2">
                                                Required for new articles. Optional when editing existing content.
                                            </p>
                                        </div>

                                        <div className="rounded-2xl border border-[#e6dfd6] bg-white overflow-hidden">
                                            <div className="px-3 py-2 border-b border-[#ece4db] text-xs font-semibold uppercase tracking-[0.14em] text-[#7c756f]">
                                                Cover Preview
                                            </div>
                                            {coverPreviewUrl ? (
                                                <img
                                                    src={coverPreviewUrl}
                                                    alt="Cover preview"
                                                    className="w-full h-44 object-cover"
                                                />
                                            ) : (
                                                <div className="h-44 grid place-items-center text-sm text-[#807a73] bg-[#faf7f2]">
                                                    No cover selected
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="admin-label">Article body</label>
                                        <div className="tinymce-editor-shell">
                                            <Editor
                                                onInit={(_evt, editor) => {
                                                    editorRef.current = editor;
                                                }}
                                                value={articleForm.content}
                                                onEditorChange={(value) =>
                                                    setArticleForm((previous) => ({
                                                        ...previous,
                                                        content: value,
                                                    }))
                                                }
                                                init={editorInit}
                                            />
                                        </div>
                                        <p className="text-xs text-[#7a746d] mt-2">
                                            Tip: use Image options to set wrap-left or wrap-right, then resize width directly in the editor.
                                        </p>
                                    </div>

                                    {isUploadingImage ? (
                                        <p className="text-sm text-[#c36d16] font-semibold">
                                            Uploading image to your media library...
                                        </p>
                                    ) : null}

                                    <div className="flex flex-wrap items-center gap-2">
                                        <button
                                            type="submit"
                                            disabled={isSavingArticle || isUploadingImage}
                                            className="admin-primary-btn"
                                        >
                                            {isSavingArticle
                                                ? "Saving..."
                                                : articleForm.editingArticleId
                                                    ? "Save Changes"
                                                    : "Publish Article"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={openCreateArticlePanel}
                                            className="admin-secondary-btn"
                                        >
                                            Reset Form
                                        </button>
                                    </div>
                                </form>
                            </section>
                        ) : null}

                        {activeSection === "articles" ? (
                            <section className="admin-panel p-5 md:p-6 space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <h2 className="text-xl md:text-2xl font-black text-[#332e2a]">
                                        Manage Articles
                                    </h2>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(event) => setSearchQuery(event.target.value)}
                                        placeholder="Search by title, category, author"
                                        className="admin-input w-full sm:w-72"
                                    />
                                </div>

                                <div className="space-y-3">
                                    {filteredArticles.map((article) => (
                                        <article key={article.id} className="admin-row-card">
                                            <div className="min-w-0">
                                                <p className="font-semibold text-[#35302c] truncate">
                                                    {article.title}
                                                </p>
                                                <p className="mt-1 text-sm text-[#69625d]">
                                                    {article.author || "Unknown author"} • {article.type || "Uncategorized"} • {formatDate(article.created_at)}
                                                </p>
                                                <p className="mt-2 text-sm text-[#5f5953] line-clamp-2">
                                                    {stripRichText(article.content || "", 180)}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditArticle(article.id)}
                                                    className="admin-outline-btn"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteArticle(article.id)}
                                                    className="admin-danger-btn"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </article>
                                    ))}

                                    {filteredArticles.length === 0 ? (
                                        <p className="text-sm text-[#6b655e]">
                                            No matching articles found.
                                        </p>
                                    ) : null}
                                </div>
                            </section>
                        ) : null}

                        {activeSection === "categories" ? (
                            <section className="admin-panel p-5 md:p-6 space-y-5">
                                <div>
                                    <h2 className="text-xl md:text-2xl font-black text-[#332e2a]">
                                        Category Management
                                    </h2>
                                    <p className="text-sm text-[#6b655f] mt-1">
                                        Create, rename, and curate categories for clean article organization.
                                    </p>
                                </div>

                                <form onSubmit={handleCreateCategory} className="flex flex-wrap gap-2">
                                    <input
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(event) => setNewCategoryName(event.target.value)}
                                        placeholder="Create a new category"
                                        className="admin-input flex-1 min-w-[220px]"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSavingCategory}
                                        className="admin-primary-btn"
                                    >
                                        {isSavingCategory ? "Saving..." : "Add Category"}
                                    </button>
                                </form>

                                <div className="space-y-3">
                                    {types.map((entry) => (
                                        <article key={entry.id} className="admin-row-card">
                                            <div className="flex-1 min-w-[200px]">
                                                <p className="text-xs uppercase tracking-[0.14em] text-[#7a746d] mb-2">
                                                    Articles in category: {articleCountByTypeName[entry.name] || 0}
                                                </p>
                                                <input
                                                    type="text"
                                                    value={typeDrafts[entry.id] ?? entry.name}
                                                    onChange={(event) =>
                                                        setTypeDrafts((previous) => ({
                                                            ...previous,
                                                            [entry.id]: event.target.value,
                                                        }))
                                                    }
                                                    className="admin-input"
                                                />
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRenameCategory(entry.id)}
                                                    className="admin-outline-btn"
                                                >
                                                    Rename
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteCategory(entry.id)}
                                                    className="admin-danger-btn"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </article>
                                    ))}

                                    {types.length === 0 ? (
                                        <p className="text-sm text-[#6b655e]">
                                            No categories yet. Add your first one above.
                                        </p>
                                    ) : null}
                                </div>
                            </section>
                        ) : null}

                        {activeSection === "comments" ? (
                            <section className="admin-panel p-5 md:p-6 space-y-4">
                                <h2 className="text-xl md:text-2xl font-black text-[#332e2a]">
                                    Comment Moderation
                                </h2>

                                <div className="space-y-3">
                                    {flattenedComments.map((comment) => (
                                        <article key={comment.id} className="admin-row-card">
                                            <div className="min-w-0">
                                                <p className="font-semibold text-[#3f3934] truncate">
                                                    {comment.author}
                                                </p>
                                                <p className="text-xs uppercase tracking-[0.12em] text-[#827c74] mt-1">
                                                    {comment.articleTitle} • {formatDate(comment.created_at)}
                                                </p>
                                                <p className="text-sm text-[#5f5953] mt-2 leading-relaxed">
                                                    {comment.content}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    className="admin-danger-btn"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </article>
                                    ))}

                                    {flattenedComments.length === 0 ? (
                                        <p className="text-sm text-[#6b655e]">
                                            No comments to moderate yet.
                                        </p>
                                    ) : null}
                                </div>
                            </section>
                        ) : null}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Admin;
