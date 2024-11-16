import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiErrors.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    try {
        const { channelId } = req.params
        const { userId } = req.user?.id
        let sub

        if (!isValidObjectId(channelId) || !isValidObjectId(userId))
            throw new ApiError(400, "Invalid videoId or userId");

        const subscription = await Subscription.findOne({ channel: channelId, subscriber: userId })
        if (!subscription) {
            sub = await Subscription.create({
                channel: channelId,
                subscriber: userId
            })

        }
        else {
            sub = await Subscription.findOneAndDelete({ channel: channelId, subscriber: userId })
        }

        return res.status(200).json(new ApiResponse(200, sub, "Subscribed to channel"))
    } catch (error) {
        throw new ApiError(500, "Error while toggling subscription")
    }

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    try {
        const { channelId } = req.params

        if (!isValidObjectId(channelId))
            throw new ApiError(400, "Invalid channelId")

        const subscribers = await Subscription.find({ channel: channelId })


        return res.status(200).json(new ApiResponse(200, subscribers.length(), "Subscribers found"))
    } catch (error) {
        throw new ApiError(500, "Error while getting subscribers")
    }
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    try {
        const { subscriberId } = req.params

        if (!isValidObjectId(subscriberId))
            throw new ApiError(400, "Invalid subscriberId")

        const channels = await Subscription.find({ subscriber: subscriberId })

        return res.status(200).json(new ApiResponse(200, channels.length(), "Channels found"))
    } catch (error) {
        throw new ApiError(500, "Error while getting subscribed channels")
    }
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}