import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiErrors.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { isValidObjectId } from 'mongoose';


const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    try {
        const { videoId } = req.params
        const { page = 1, limit = 10 } = req.query

        if (!isValidObjectId(videoId))
            throw new ApiError(400, "Invalid videoId");

        const skip = (page - 1) * limit;
        const pipeline = [
            // Match comments related to the given videoId
            {
                $match: {
                    videoId: new mongoose.Types.ObjectId(videoId) // Ensure videoId is an ObjectId
                }
            },
            // Sort comments by creation date (newest first)
            {
                $sort: { createdAt: -1 }
            },
            // Pagination
            {
                $skip: skip
            },
            {
                $limit: parseInt(limit)
            },
            // Optionally populate user details (if you have a reference to the user)
            {
                $lookup: {
                    from: 'users', // Assuming your user collection is called 'users'
                    localField: 'userId', // Assuming comments have a 'userId' field
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            // Project specific fields you want to return
            {
                $project: {
                    _id: 1,
                    text: 1,
                    createdAt: 1,
                    userDetails: { $arrayElemAt: ["$userDetails", 0] }
                }
            }
        ];

        const comments = await Comment.aggregate(pipeline)
        if(comments.length === 0) throw new ApiError(404, "Comments not found")
        return res.status(201).json(new ApiResponse(201, comments, "Comments found"))
    } catch (error) {
        throw new ApiError(500, "Error while getting comments")
    }

})

const addComment = asyncHandler(async (req, res) => {
    try {
        const {  comment } = req.body
        const { userId } = req.user?.id
        const { videoId } = req.params
        if (!isValidObjectId(userId) || !isValidObjectId(videoId))
            throw new ApiError(400, "Invalid userId or videoId");

        const newComment = await Comment.create({
            userId,
            videoId,
            comment
        })
        return res.status(200).json(new ApiResponse(200, newComment, "Comment added")

        )
    } catch (error) {
        throw new ApiError(500, "Error while adding comment")
    }
    // TODO: add a comment to a video
})

const updateComment = asyncHandler(async (req, res) => {
    try {
        const { comment } = req.body
        const { userId } = req.user?.id
        const { videoId } = req.params


        if (!isValidObjectId(userId) || !isValidObjectId(videoId))
            throw new ApiError(400, "Invalid userId or videoId");

        const updateComment = await Comment.findOneAndUpdate({ userId, videoId }, { comment })
        if (updateComment === null) throw new ApiError(404, "Comment not found")
        return res.status(200).json(new ApiResponse(200, updateComment, "Comment updated"))
    } catch (error) {
        throw new ApiError(500, "Error while updating comment")
    }
    // TODO: update a comment

})

const deleteComment = asyncHandler(async (req, res) => {
    try {
        const {  comment } = req.body
        const { videoId } = req.params
        const { userId } = req.user?.id


        if (!isValidObjectId(userId) || !isValidObjectId(videoId))
            throw new ApiError(400, "Invalid userId or videoId");

        const deleteComment = await Comment.findOneAndDelete({ userId, videoId })
        if (deleteComment === null) throw new ApiError(404, "Comment not found")
        return res.status(200).json(new ApiResponse(200, deleteComment, "Comment deleted"))
    } catch (error) {
        throw new ApiError(500, "Error while updating comment")
    }
    // TODO: delete a comment
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}