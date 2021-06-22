const { validationResult } = require("express-validator/check");
const Article = require("../models/Article");
const Project = require("../models/Project");
const User = require("../models/User");
const io = require("../socket");
exports.getarticles = async (req, res, next) => {
  try {
    const articles = await Article.find({ active: true });

    if (!articles) {
      const error = new Error("Could not find articles.");
      error.statusCode = 404;
      throw error;
    }
    return res.status(200).json(articles);
  } catch (error) {
    console.log(error);

    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.projects = async (req, res, next) => {
  try {
    const projects = await Project.find({active:true});

    if (!projects) {
      const error = new Error("Could not find projects.");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json(projects);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};



exports.getarticle = async (req, res, next) => {
  const id = req.params.id;

  try {
    const article = await Article.findById(id);
    if (!article) {
      const error = new Error("Could not find article.");
      error.statusCode = 404;
      throw error;
    }
    return res.status(200).json({ article: article });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};



exports.searchUser = (req, res, next) => {
  const searchValue = req.body.searchValue;
};

exports.addComment = async (req, res, next) => {
  const id = req.params.id;
  const comment = req.body.comment;
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      console.log("no");
    }

    const article = await Article.findOne({ _id: id });

    let newComment = {
      userId: user._id,
      username: user.name,
      userPicture: user.profilePicture,
      comment: comment
    };

    article.comments.push(newComment);
    await article.save();
    res.status(200).json(article);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getComments = async (req, res, next) => {
  const id = req.params.id;

  try {
    const article = await Article.findOne({ _id: id });
    const comments = article.comments;

    return res.status(200).json(comments);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.react = async (req, res, next) => {
  const id = req.params.id;
  const react = req.query.react

  try {
    const article = await Article.findById(id);
    if (!article) {
      const error = new Error("No article Found..");
      error.statusCode = 401;
      next(error);
      throw error;
    }
    console.log(req.user);

    const index = article.reactions[react].users.findIndex(u => u.id.toString() === req.user.id.toString())

    if (index <= -1) {
      article.reactions[react].users.push({ id: req.user.id })
      article.reactions[react].counter += 1
    } else {
      article.reactions[react].users = article.reactions[react].users.filter(u => u.id.toString() != req.user.id.toString())
      article.reactions[react].counter -= 1
    }

    await article.save();
    return res.status(200).json({ message: "Liked", reactions: article.reactions });
  } catch (error) {
    error.statusCode = 500;
    return next(error);
  }
};

exports.getLikes = async (req, res, next) => {
  const id = req.params.id;

  try {
    const article = await Article.findOne({ _id: id });
    if (!article) {
      const error = new Error("No article Found..");
      error.statusCode = 401;
      return next(error);
    }
    const likes = article.like;
    return await res.status(200).json({ likes: likes });
  } catch (error) {
    console.log(error);
    error.statusCode = 500;
    return next(error);
  }
};


exports.newView = async (req, res, next) => {
  const id = req.params.id
  const item = req.query.item

  try {
    if (item == 'article') {
      console.log(item);
      await Article.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
    }
    return res.status(200).json({ message: 'ok' })
  } catch (error) {
    error.statusCode = 500;
    return next(error);
  }
}