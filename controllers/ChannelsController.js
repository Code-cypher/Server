import mongoose from 'mongoose';
import User from '../models/UserModel.js';
import Channel from '../models/ChannelModel.js'
import Message from '../models/MessageModel.js'

export const createChannel = async (req, res) => {
    try {
        const { name, members } = req.body;
        const userId = req.userId;

        const admin = await User.findById(userId);

        if (!admin) {
            return res.status(400).send("Admin user not found.");
        }
        const validMembers = await User.find({ _id: { $in: members } });

        if (validMembers.length !== members.length) {
            return res.status(400).send("Some members are not valid users.");
        }

        const newChannel = new Channel({
            name,
            members,
            admin: userId,
        })

        await newChannel.save();

        res.status(201).json({ channel: newChannel });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const getUserChannels = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);
        const channels = await Channel.find({ $or: [{ admin: userId }, { members: userId }] }).sort({ createdAt: -1 });


        return res.status(201).json({ channels });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getChannelMessages = async (request, response , next) => {
    try {
        const {channelId} = request.params.id;
        const channel = await Channel.findById(channelId).populate({path: "messages", populate: {path: "sender", select : "firstName lastName email _id image color"}});

        if (!channel) {
            return response.status(400).send("Channel not found" );
        }

        const messages = await Message.find({ channel: channelId }).sort({ createdAt: 1 });

        return response.status(201).json({ messages });
    } catch (error) {
        return response.status(500).json({ message: error.message });
    }
}