// 从文件中读取数据并生成文章
async function loadArticles() {
  try {
    const response = await fetch("/boke/blog.txt");
    const text = await response.text();
    const articlesData = text.split("\n").map((line) => {
      const startIndexTitle = line.indexOf("<") + 1;
      const endIndexTitle = line.indexOf(">");
      const title = line.substring(startIndexTitle, endIndexTitle);
      const startIndexContent = line.indexOf("{") + 1;
      const endIndexContent = line.indexOf("}");
      const content = line.substring(startIndexContent, endIndexContent);
      const startIndexLink = line.indexOf('"') + 1;
      const endIndexLink = line.lastIndexOf('"');
      const link = line.substring(startIndexLink, endIndexLink);
      const startIndexIcon = line.indexOf("--") + 2;
      const endIndexIcon = line.indexOf("--", startIndexIcon);
      const icon = line.substring(startIndexIcon, endIndexIcon);
      return { title, content, link, icon };
    });
    const container = document.querySelector(".container");
    articlesData.forEach((data) => {
      const shortContent =
        data.content.length > 10
          ? data.content.substring(0, 50) + "..."
          : data.content;
      const article = document.createElement("article");
      const img = document.createElement("img");
      img.src = data.icon;
      img.alt = data.title + " icon";
      const contentWrapper = document.createElement("div");
      contentWrapper.classList.add("content-wrapper");
      const titleElement = document.createElement("h2");
      titleElement.textContent = data.title;
      const contentElement = document.createElement("p");
      contentElement.textContent = shortContent;
      contentWrapper.appendChild(titleElement);
      contentWrapper.appendChild(contentElement);
      article.appendChild(img);
      article.appendChild(contentWrapper);
      article.addEventListener("click", () => {
        window.open(data.link, "_blank");
      });
      container.appendChild(article);
    });
  } catch (error) {
    console.error("加载文章失败：", error);
  }
}

// 简单的搜索功能示例，实际应用中需要连接后端进行更复杂的搜索
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();
  const articles = document.querySelectorAll("article");
  articles.forEach((article) => {
    const articleTitle = article.querySelector("h2").textContent.toLowerCase();
    const articleContent = article.textContent.toLowerCase();
    if (
      articleTitle.includes(searchTerm) ||
      articleContent.includes(searchTerm)
    ) {
      article.style.display = "block";
    } else {
      article.style.display = "none";
    }
  });
});

loadArticles();
