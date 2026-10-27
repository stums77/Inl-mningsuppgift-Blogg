const POSTS_KEY = "svampletarnaPosts";
const USER_KEY = "inloggadAnvandare";
const postForm = document.querySelector("#post-form");
const createSection = document.querySelector("#create-section");
const postsContainer = document.querySelector("#posts-container");
const loginMessage = document.querySelector("#login-message");
function getCurrentUser() {
    const user = localStorage.getItem(USER_KEY);
    return user?.trim() || null;
}
function loadPosts() {
    try {
        const savedPosts = localStorage.getItem(POSTS_KEY);
        if (!savedPosts) {
            return [];
        }
        const posts = JSON.parse(savedPosts);
        if (!Array.isArray(posts)) {
            return [];
        }
        return posts;
    }
    catch {
        return [];
    }
}
function savePosts(posts) {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}
function createId() {
    return crypto.randomUUID();
}
function formatDate(date) {
    return new Date(date).toLocaleString("sv-SE", {
        dateStyle: "short",
        timeStyle: "short"
    });
}
function createTextElement(tag, className, text) {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = text;
    return element;
}
function renderPosts() {
    if (!postsContainer)
        return;
    postsContainer.replaceChildren();
    const posts = loadPosts();
    const currentUser = getCurrentUser();
    if (posts.length === 0) {
        const message = document.createElement("p");
        message.textContent =
            "Det finns inga blogginlägg ännu. Bli den första att dela ett svampfynd!";
        postsContainer.append(message);
        return;
    }
    // Visa de senaste inläggen först.
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    for (const post of posts) {
        const card = document.createElement("article");
        card.className = "post-card";
        card.append(createTextElement("h3", "post-title", post.title), createTextElement("p", "post-meta", `Skrivet av ${post.author} · ${formatDate(post.date)}`), createTextElement("p", "post-body", post.text));
        const commentsSection = document.createElement("section");
        commentsSection.className = "comments";
        commentsSection.append(createTextElement("h4", "comments-heading", `Kommentarer (${post.comments.length})`));
        for (const comment of post.comments) {
            const commentElement = document.createElement("div");
            commentElement.className = "comment";
            commentElement.append(createTextElement("p", "comment-body", comment.text), createTextElement("p", "comment-meta", `${comment.author} · ${formatDate(comment.date)}`));
            commentsSection.append(commentElement);
        }
        if (currentUser) {
            const commentForm = document.createElement("form");
            commentForm.className = "comment-form";
            commentForm.dataset.postId = post.id;
            const label = document.createElement("label");
            const textarea = document.createElement("textarea");
            const button = document.createElement("button");
            const textareaId = `comment-${post.id}`;
            label.htmlFor = textareaId;
            label.textContent = "Skriv en kommentar";
            textarea.id = textareaId;
            textarea.name = "comment";
            textarea.rows = 3;
            textarea.maxLength = 1000;
            textarea.required = true;
            textarea.placeholder = "Dela dina tankar...";
            button.type = "submit";
            button.textContent = "Kommentera";
            commentForm.append(label, textarea, button);
            commentsSection.append(commentForm);
        }
        card.append(commentsSection);
        postsContainer.append(card);
    }
}
function updateLoginView() {
    const currentUser = getCurrentUser();
    if (createSection) {
        createSection.hidden = !currentUser;
    }
    if (loginMessage) {
        loginMessage.textContent = currentUser
            ? `Du är inloggad som ${currentUser} och kan skriva inlägg och kommentarer.`
            : "Du kan läsa bloggen utan att logga in. Logga in för att skriva inlägg och kommentarer.";
    }
}
// Publicera ett nytt blogginlägg.
postForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const currentUser = getCurrentUser();
    if (!currentUser || !postForm) {
        updateLoginView();
        return;
    }
    const formData = new FormData(postForm);
    const title = String(formData.get("title") ?? "").trim();
    const text = String(formData.get("text") ?? "").trim();
    if (!title || !text)
        return;
    const newPost = {
        id: createId(),
        title,
        author: currentUser,
        text,
        date: new Date().toISOString(),
        comments: []
    };
    const posts = loadPosts();
    posts.push(newPost);
    savePosts(posts);
    postForm.reset();
    renderPosts();
});
// Lägg till kommentarer i det inlägg som formuläret tillhör.
postsContainer?.addEventListener("submit", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLFormElement))
        return;
    if (!target.matches(".comment-form"))
        return;
    event.preventDefault();
    const currentUser = getCurrentUser();
    if (!currentUser) {
        updateLoginView();
        return;
    }
    const postId = target.dataset.postId;
    const formData = new FormData(target);
    const text = String(formData.get("comment") ?? "").trim();
    if (!postId || !text)
        return;
    const posts = loadPosts();
    const post = posts.find(item => item.id === postId);
    if (!post)
        return;
    post.comments.push({
        id: createId(),
        author: currentUser,
        text,
        date: new Date().toISOString()
    });
    savePosts(posts);
    renderPosts();
});
// Starta bloggen när sidan öppnas.
updateLoginView();
renderPosts();
export {};
