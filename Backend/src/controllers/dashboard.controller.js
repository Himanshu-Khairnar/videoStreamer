import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiErrors.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    try {
        // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
        const { userId } = req.user?.id
        if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid userId")
        const videoViews = await Video.aggregate([
            {
                $group: {
                    _id: null,
                    totalViews: {
                        $sum: "$views"
                    }
                }
            }
        ])

        const totalVideos = await Video.countDocuments()

        const totalSubscribers = await Subscription.countDocuments({ user: userId })

        const totalLikes = await Like.countDocuments({ likedBy: userId })
        if (!videoViews && !totalVideos && !totalSubscribers && !totalLikes) throw new ApiError(404, "No views,videos,sub and likes found")


        return res.status(200).json(new ApiResponse(200, { videoViews, totalVideos, totalSubscribers, totalLikes }, "Channel stats"))
    } catch (error) {
        throw new ApiError(500, "Error while getting channel stats")
    }
})

const getChannelVideos = asyncHandler(async (req, res) => {
    try {

        const { userId } = req.user?.id
        if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid userId")
        const getAllVideos = await Video.find({ user: userId })
        if (!getAllVideos) throw new ApiError(404, "No videos found")
        return res.status(200).json(new ApiResponse(200, getAllVideos, "All videos"))
        // TODO: Get all the videos uploaded by the channel
    } catch (error) {
        throw new ApiError(500, "Error while getting channel videos")
    }
})

export {
    getChannelStats,
    getChannelVideos
}