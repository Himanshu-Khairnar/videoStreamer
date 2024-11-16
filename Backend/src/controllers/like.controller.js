import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiErrors.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params
        const { userId } = req.user.id
        let like
        let toggleVideoLike

        if (!isValidObjectId(videoId) || !isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid videoId or userId");
        }

        const videos = await Like.findOne({ video: videoId, likedBy: userId })
        if (!videos) {
            toggleVideoLike = await Like.create({
                video: videoId,
                likedBy: userId
            })
            like = true
        }
        else {
            toggleVideoLike = await Like.findOneAndDelete({ video: videoId, likedBy: userId })
            like = false
        }

        return res.status(200).json(new ApiResponse(200, toggleVideoLike, `${like ? "Video liked" : "Video unliked"}`))
    } catch (error) {
        throw new ApiError(500, "Error while toggling video like")
    }


})

const toggleCommentLike = asyncHandler(async (req, res) => {
    try {
        const { commentId } = req.params
        const { } = req.user?.id
        let toggleCommentLike
        let like

        if (!isValidObjectId(commentId) || !isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid videoId or userId");
        }

        const comment = await Comment.findOne({ comment: commentId, likedBy: userId })
        if (!comment) {
            toggleCommentLike = await Like.create({
                comment: commentId,
                likedBy: userId
            })
            like = true
        }
        else {
            toggleCommentLike = await Like.findOneAndDelete({ comment: commentId, likedBy: userId })
            like = false

        }

        return res.status(200).json(new ApiResponse(200, toggleCommentLike, `${like ? "Comment liked" : "Comment unliked"}`))

    } catch (error) {
        throw new ApiError(500, "Error while toggling comment like")
    }
})

const getLikedVideos = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.user?.id
        const videos = await Like.find({ likedBy: userId })
        return res.status(200).json(new ApiResponse(200, videos, "Videos found"))
    } catch (error) {
        throw new ApiError(500, "Error while getting liked videos")
    }
})

export {
    toggleCommentLike,
    toggleVideoLike,
    getLikedVideos
}