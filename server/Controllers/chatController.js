const chatModel = require("../Models/chatModel");


// CREATE CHAT
const createChat = async (req, res) => {
    const {firstId, secondId} = req.body;
    try {
        const chat = await chatModel.findOne({
            members: {
                $all: [firstId, secondId]
            },
        });
        
        // IF THERE IS EXIT 
        if (chat) return res.status(200).json(chat);

        const newChat = new chatModel({
            members: [firstId, secondId]
        });

        const response = await newChat.save();
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}


// FIND USER CHAT 
const findUserChats = async (req, res) => {
    const userId = req.params.userId;

    try {
        const chats = await chatModel.find({
            members: {
                $in: [userId]
            }
        });

        res.status(200).json(chats);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}


// FIND CHAT

const findChat = async (req, res) => {
    const {firstId, sencondId} = req.params;

    try {
        const chat = await chatModel.findOne({
            members: {
                $all: [firstId, sencondId]
            }
        });

        res.status(200).json(chat);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}


module.exports = {createChat, findUserChats, findChat}