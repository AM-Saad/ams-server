const express = require("express");
const feedController = require("../controllers/feed");
const isAuth = require("../middleware/isAuth");
const { body } = require("express-validator/check");
const router = express.Router();

router.get("/articles", feedController.getarticles);
router.get("/articles/:id", feedController.getarticle);


router.get("/projects", feedController.projects);
// router.get("/projects/:id",  feedController.project);


router.put("/comments/:id", feedController.addComment);
router.get("/comments/:id", feedController.getComments);

router.put("/react/:id", isAuth, feedController.react);
router.get("/likes/:id", feedController.getLikes);

router.put("/view/:id", feedController.newView);


module.exports = router;
