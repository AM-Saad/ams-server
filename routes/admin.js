const express = require("express");
// const { body } = require("express-validator/check");
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/isAuth");
const router = express.Router();


router.post("/login", adminController.login);

router.get("/articles", isAuth, adminController.articles);
router.get("/articles/:id", isAuth, adminController.getArticle);
router.post("/articles", isAuth, adminController.createArticle);
router.delete("/articles/:id", isAuth, adminController.deleteArticle);
router.put("/articles/:id", isAuth, adminController.editArticle);

router.get("/projects/", isAuth, adminController.projects);
// router.get("/projects/:id", isAuth, adminController.getProjects);
router.post("/projects", isAuth, adminController.createProject);
router.delete("/projects/:id", isAuth, adminController.deleteProject);
router.put("/projects/:id", isAuth, adminController.editProject);

router.get("/users", isAuth, adminController.users);
router.get("/users/:id", isAuth, adminController.getUser);
router.delete("/users/:id", isAuth, adminController.deleteUser);


router.post('/media', adminController.uploadImage)
router.put('/media', adminController.deleteImage)



router.get('/category', adminController.getCategories);
router.post('/category', isAuth, adminController.postCategory);
router.put('/category/:id', isAuth, adminController.editCategory)
router.delete('/category/:id', isAuth, adminController.deleteCategory)

module.exports = router;
