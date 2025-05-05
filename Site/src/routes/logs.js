var express = require("express");
var router = express.Router();
const logsController = require("../controllers/logsController");

router.get("/", function (req, res){
  logsController.receberLogs(req, res)
});

module.exports = router;
