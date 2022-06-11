const messsageModel = require('../models/messageModel');
module.exports.addMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;

        const data = await messsageModel.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        });
        if (data) return res.json({ msg: "Message added successfully." });
        else return res.json({ msg: "Failed to add message to the database" });
    } catch (ex) {
        next(ex);
    }
}

module.exports.getAllMessage = async (req, res, next) => {
    try {
        const { from, to } = req.body;
        const messages = await messsageModel.find({
            users: {
                $all: [from, to]
            }
        }).sort({ updatedAt: 1 });
        const projectMessages = messages.map((msg) => {
            return {
                fromSelt: msg.sender.toString() === from,
                message: msg.message.text
            };
        });

        res.json(projectMessages);
    } catch (err) {

    }
}