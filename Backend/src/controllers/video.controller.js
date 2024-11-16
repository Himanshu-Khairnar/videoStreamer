import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiErrors.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;

    try {
        const pipeline = [
            {
                $match: {

                    $or: [
                        { title: { $regex: new RegExp(query, "i") } },
                        { description: { $regex: new RegExp(query, "i") } },
                    ],
                    ...(userId ? { userId } : {}),
                },
            },
            {
                $sort: {
                    [sortBy]: sortType === "asc" ? 1 : -1,
                },
            },
            {
                $skip: (page - 1) * limit,
            },
            {
                $limit: limit,
            },
        ];

        // Execute the aggregation pipeline
        const videos = await Video.aggregate(pipeline);

        return res.status(200).json(new ApiResponse(200, videos, "Video's found"))

    } catch (err) {
        throw new ApiError(500, "Error while getting videos")
    }
});

const publishAVideo = asyncHandler(async (req, res) => {
    try {
        const { title, description } = req.body
        const { userId } = req.user

        if (!title || !description)
            throw new ApiError(400, "All fields are required")

        const videoFileLocalPath = req.files?.videoFile[0]?.path
        const thumbnailLocalPath = req.files?.thumbnail[0]?.path
        if (!videoFileLocalPath || !thumbnailLocalPath)
            throw new ApiError(400, "Video and Thumbnail are required")


        const videoFile = await uploadOnCloudinary(videoFileLocalPath)
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

        console.log(videoFile, thumbnail)
        if (!videoFile.url || !thumbnail.url)
            throw new ApiError(400, "Video and Thumbnail not uploaded")

        const videoDuration = videoFile.duration

        if (!videoDuration)
            throw new ApiError(400, "Video duration not found")

        const video = await Video.create({
            videoFile: videoFile.url,
            thumbnail: thumbnail.url,
            title,
            description,
            duration: videoDuration,
            owner: userId
        })

        return res.status(200).json(new ApiResponse(200, video, "Video created found"))
    } catch (error) {
        throw new ApiError(500, "Error while publishing video")
    }


})

const getVideoById = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params
        const video = await Video.findById(videoId)

        if (!video)
            throw new ApiError(404, "Video not found")

        return res.status(200).json(new ApiResponse(200, video, "Video found"))
    } catch (error) {
        throw new ApiError(500, "Error while getting video by id")
    }
})


const updateVideo = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params
        const { title, description } = req.body

        if (!title || !description)
            throw new ApiError(404, "title || description not found")
        const thumbnailLocalPath = req.files?.thumbnail[0]?.path

        if (!thumbnailLocalPath)
            throw new ApiError(404, "Thumbnail not found")

        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
        const video = await Video.findByIdAndUpdate(videoId, { title, description, thumbnail }, { new: true })

        if (!video)
            throw new ApiError(404, "Video not found")
        console.log(video)
        return res.status(200).json(new ApiResponse(200, video, "Video updated"))
    } catch (error) {
        console.log(error)
    }
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const deleteSingleVideo = await Video.findByIdAndDelete(videoId)

    if (!deleteSingleVideo)
        throw new ApiError(404, "Video not found")

    return res.status(200).json(new ApiResponse(200, deleteSingleVideo, "Video deleted"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    try {
        
        const { videoId } = req.params
    
        const video = await Video.findById(videoId)
    
        if (!video)
            throw new ApiError(404, "Video not found")
    
        video.published = !video.published
        const updatedVideo = await video.save()
        return res.status(200).json(new ApiResponse(200, updatedVideo, "Video status updated"))
    } catch (error) {
        throw new ApiError(500, "Error while updating video status")
    }
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}