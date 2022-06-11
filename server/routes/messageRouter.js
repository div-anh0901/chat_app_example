const { addMessage, getAllMessage } = require("../controller/messageController");

const router = require("express").Router();

router.post("/addms", addMessage);
router.post("/getAllms", getAllMessage);


module.exports = router;