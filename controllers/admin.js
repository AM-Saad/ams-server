const User = require("../models/User");
const Article = require("../models/Article");
const Project = require("../models/Project");
const Category = require("../models/Category");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const fs = require('fs')

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    console.log(req.body);

    const user = await User.findOne({ email: email });
    try {
        if (user) {
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                return res.status(401).json({ message: 'Email OR password not correct!' });
            }
            const token = jwt.sign(
                {
                    name: user.name,
                    id: user._id.toString(),
                    image: user.profilePicture
                },
                "SomeSuperAsecretBymy",
                { expiresIn: "9h" }
            );

            return res.status(200).json({ token: token, user: user });
        }
    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: 'Something went wrong' });
    }
};


exports.users = async (req, res, next) => {
    try {
        const users = await User.find();
        return await res.status(200).json({
            users: users
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.getUser = async (req, res, next) => {
    const userId = req.params.id
    try {
        const user = await User.findById(userId);
        if (!user) {
            const error = new Error("Could not find user.");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'Somthing went wrong. Please try again.', messageType: 'warning' })
        await user.remove()
        return res
            .status(200)
            .json({ message: "User Delete", userId: userId });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};





exports.articles = async (req, res, next) => {
    try {
        const articles = await Article.find();

        return await res.status(200).json({
            articles: articles
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.createArticle = async (req, res, next) => {
    const content = req.body.content;
    const title = req.body.title;
    const category = req.body.category;
    const sub = req.body.sub;
    const tags = JSON.parse(req.body.tags);
    const lang = req.body.lang
    const active = req.body.active
    const site_description = req.body.site_description
    // const delta = JSON.parse(req.body.delta);

    let image;
    if (req.file) {
        image = req.file.path.replace("\\", "/");
    } else {
        image = ''
    }
    try {
        const article = new Article({
            title: title,
            content: content,
            image: image,
            tags: tags,
            category: { name: category, sub: sub },
            shares: [],
            comments: [],
            reactions: {
                highfive: {
                    users: [],
                    counter: 0
                },
                like: {
                    users: [],
                    counter: 0
                },
                dislike: {
                    users: [],
                    counter: 0
                },
            },
            discussion: [],
            date: moment().format('YYYY-MM-DD'),
            time: moment().format('h:mm a'),
            lang: lang,
            active: active,
            site_description: site_description,
        });

        await article.save();
        return await res.status(201).json({
            message: 'Created',
            article: article
        });
    } catch (error) {
        console.log(error);


        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.getArticle = async (req, res, next) => {
    const articleId = req.params.id;
    try {

        const article = await Article.findById(articleId);
        if (!article) return res.status(404).json({ message: 'Somthing went wrong. Please try again.', messageType: 'warning' })
        return res
            .status(200)
            .json({ article: article });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.editArticle = async (req, res, next) => {
    const articleId = req.params.id;
    const content = req.body.content;
    const title = req.body.title;
    const category = req.body.category;
    const sub = req.body.sub;
    const tags = JSON.parse(req.body.tags);
    const lang = req.body.lang
    const active = req.body.active
    const site_description = req.body.site_description
    // const delta = JSON.parse(req.body.delta);

    try {
        let image;
        const article = await Article.findById(articleId)
        if (!article) { return res.status(404).json({ message: 'Somthing went wrong. Please try again.', messageType: 'warning' }) }
        if (req.file) {
            image = req.file.path.replace("\\", "/");
        } else {
            image = article.image
        }

        article.title = title
        article.content = content
        article.category = { name: category, sub: sub }
        article.image = image
        article.tags = tags
        article.lang = lang
        article.active = active
        article.site_description = site_description
        // article.delta = { ...delta }
        await article.save();
        return await res.status(200).json({ message: 'Article Updated', article: article });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.deleteArticle = async (req, res, next) => {
    const articleId = req.params.id;
    try {
        const article = await Article.findById(articleId);
        if (!article) return res.status(404).json({ message: 'Somthing went wrong. Please try again.', messageType: 'warning' })
        await article.remove()
        return res
            .status(200)
            .json({ message: "article Delete", articleId: articleId });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};



exports.projects = async (req, res, next) => {
    try {
        const projects = await Project.find();
        return await res.status(200).json({
            projects: projects
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.createProject = async (req, res, next) => {
    const brief = req.body.brief;
    const title = req.body.title;
    const subtitle = req.body.subtitle;
    const client = req.body.client;
    const demo = req.body.demo;
    const category = req.body.category;
    const sub = req.body.sub;
    const active = req.body.active;
    const site_description = req.body.site_description;
    const tags = JSON.parse(req.body.tags);
    const content = JSON.parse(req.body.content);

    let image;
    if (req.file) {
        image = req.file.path.replace("\\", "/");
    } else {
        image = ''
    }
    try {
        const project = new Project({
            title: title,
            subtitle: subtitle,
            client: client,
            demo: demo,
            brief: brief,
            category: { name: category, sub: sub },
            image: image,
            tags: tags,
            content: content,
            comments: [],
            likes: [],
            active: active,
            site_description: site_description,
        });
        await project.save();
        return await res.status(201).json({
            project: project
        });
    } catch (error) {

        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.getProject = async (req, res, next) => {
    const projectId = req.params.id;
    try {

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: 'Somthing went wrong. Please try again.', messageType: 'warning' })
        return res
            .status(200)
            .json({ project: project });
    } catch (error) {
        console.log(error);
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};

exports.editProject = async (req, res, next) => {
    const projectId = req.params.id;
    const brief = req.body.brief;
    const title = req.body.title;
    const subtitle = req.body.subtitle;
    const client = req.body.client;
    const demo = req.body.demo;
    const category = req.body.category;
    const sub = req.body.sub;
    const active = req.body.active;
    const site_description = req.body.site_description;
    const tags = JSON.parse(req.body.tags);
    const content = JSON.parse(req.body.content);


    try {
        const project = await Project.findById(projectId)
        if (!project) { return res.status(404).json({ message: 'Somthing went wrong. Please try again.', messageType: 'warning' }) }
        let image = req.file ? req.file.path.replace("\\", "/") : project.image
        project.title = title
        project.subtitle = subtitle
        project.client = client
        project.demo = demo
        project.brief = brief
        project.tags = tags
        project.content = content
        project.active = active
        project.site_description = site_description
        project.category = { name: category, sub: sub }
        project.image = image
        await project.save();
        return await res.status(200).json({ project: project });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        return next(error);
    }
};

exports.deleteProject = async (req, res, next) => {
    const projectId = req.params.id;
    try {

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: 'Somthing went wrong. Please try again.', messageType: 'warning' })
        await project.remove()
        return res
            .status(200)
            .json({ message: "project Delete", projectId: projectId });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};





exports.getCategories = async (req, res, next) => {
    const categories = await Category.find()
    return res.json({ message: 'Fetched', messageType: 'success', categories: categories })
}

exports.postCategory = async (req, res, next) => {

    const name = req.body.name
    const subCategory = JSON.parse(req.body.subCategory)
    try {
        const existCategory = await Category.findOne({ name: name })
        if (existCategory) return res.status(404).json({ message: 'Category with same name already exist', messageType: 'info' })
        if (name == '' || name == null || name == ':') return res.status(401).json({ message: 'Add Category name', messageType: 'info' })
        const newCategory = new Category({
            name: name.toLowerCase(),
            subCategory: subCategory || [],
        })
        await newCategory.save()
        return res.status(201).json({ message: 'Category Created ', messageType: 'success', category: newCategory })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error, messageType: 'danger' })
    }
}


exports.editCategory = async (req, res, next) => {
    const categoryId = req.params.id
    const name = req.body.name
    const subCategory = JSON.parse(req.body.subCategory)
    try {
        const category = await Category.findOne({ _id: categoryId })
        if (!category) return res.status(404).json({ message: 'Category Not Found', messageType: 'info' })
        if (name == '' || name == null || name == ':') return res.status(401).json({ message: 'Add Category name', messageType: 'info' })
        category.name = name
        category.subCategory = subCategory

        await category.save()
        return res.status(201).json({ message: 'Category Created ', messageType: 'success', category: category })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error, messageType: 'danger' })
    }
}

exports.deleteCategory = async (req, res, next) => {
    const categoryId = req.params.id
    try {
        const category = await Category.findOne({ _id: categoryId })
        await category.remove()
        return res.status(200).json({ message: 'Category Deleted', messageType: 'success', })
    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: 'Something went wrong, please try again.', messageType: 'danger' })
    }
}


exports.uploadImage = async (req, res, next) => {
    console.log('here');
    if (req.file) return res.status(200).json('/' + req.file.path.replace("\\", "/"))
}


exports.deleteImage = async (req, res, next) => {
    const name = req.body.name
    console.log(req.body);

    fs.unlink(`.${name}`, function (error) {
        if (error) return res.status(500).json({ message: 'Something went wrong, please try again.', messageType: 'danger' })
    });

}