var express = require("express");
var router = express.Router();
const authMiddleware = require('../middlewares/auth'); 

var usuarioRouter = require('../controllers/usuarioController');


router.post("/cadastrar", function (req, res){
  usuarioRouter.cadastrar(req, res)
})

router.post("/login", function (req, res) {
  usuarioRouter.login(req, res)

})
router.use('/uploads', express.static('uploads'));
router.post('/profile/photo', authMiddleware, userController.uploadProfilePhoto);
router.get('/profile/photo/:userId', userController.getProfilePhoto);

module.exports = router;
