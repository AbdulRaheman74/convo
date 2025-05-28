import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { getRecieverSocketId, io } from "../socket/socketio.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;

    console.log(message);

    let conversation = await Conversation.findOne({
      parcipants: { $all: [senderId, receiverId] }
    });

    // Establish the conversation if not already created
    if (!conversation) {
      conversation = await Conversation.create({
        parcipants: [senderId, receiverId]
      });
    }

    const newMessage = await Message.create({
      senderId,
      recieverId: receiverId,
      message
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    // Implement socket.io for real-time data transfer
    const receiverSocketId = getRecieverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json({ success: true, newMessage });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    const conversation = await Conversation.findOne({
      parcipants: { $all: [senderId, receiverId] }
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json({ success: true, messages: [] });
    }

    return res.status(200).json({
      success: true,
      messages: conversation.messages
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
