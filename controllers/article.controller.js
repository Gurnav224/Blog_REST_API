const Article = require("../models/article.model");

exports.createArticle = async (req, res) => {
  const { title, subtitle, body, likes, author, tags, isPublished, slug } =
    req.body;
  try {
    const article = new Article({
      title,
      subtitle,
      body,
      likes,
      author,
      tags,
      isPublished,
      slug,
    });
    await article.save();
    res
      .status(201)
      .json({ message: "new article created successfully", article });
  } catch (error) {
    console.log("failed to create new article", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.find({});
    if (!articles.length === 0) {
      return res.status(400).json({ message: "no Articles found" });
    }

    res.status(200).json(articles);
  } catch (error) {
    console.error("failed to get articles", error);
    res.status(500).json({ error: "failed to get articles" });
  }
};

exports.updateArticle = async (req, res) => {
  const { id } = req.params;
  const { title, subtitle, body, likes, author, tags, isPublished, slug } =
    req.body;
  try {
    const article = await Article.findOneAndUpdate(
      { _id: id },
      { title, subtitle, body, likes, author, tags, isPublished, slug }
    );
    if (!article) {
      return res.status(404).json({ message: "article not found" });
    }
    res.status(200).json({ message: "article updated successfully", article });
  } catch (error) {
    console.error("failed to update article", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getArticleDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const article = await Article.findById(id);
    if (!article) {
      return res.status(400).json({ error: "Article not found" });
    }
    res.status(200).json(article);
  } catch (error) {
    console.error("failed to  article details", error);
    res.status(500).json({ error: "failed to get article" });
  }
};

exports.deleteArticleById = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  try {
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ error: "article not found" });
    }

    if (article.author.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "you are not author of this article" });
    }
    await Article.findByIdAndDelete(id)
    res.status(200).json({ message: "article delete successfully" });
  } catch (error) {
    console.error("failed to delete article", error);
    res.status(500).json({ error: error.message });
  }
};
