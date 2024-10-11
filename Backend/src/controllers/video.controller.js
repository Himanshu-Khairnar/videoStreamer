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

        res.status(200).json({
            success: true,
            count: videos.length,
            data: videos,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "An error occurred while retrieving videos",
        });
    }
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    const { userId } = req.user

    if (!title || !description)
        throw new ApiError(400, "All fields are required")

    const videoFileLocalPath  = req.files?.videoFile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path
    if (!videoFileLocalPath || !thumbnailLocalPath)
        throw new ApiError(400, "Video and Thumbnail are required")

    
    const videoFile = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    console.log(videoFile, thumbnail)
    if(!videoFile.url || !thumbnail.url)
        throw new ApiError(400, "Video and Thumbnail not uploaded")

    const videoDuration = videoFile.duration

    if(!videoDuration)
        throw new ApiError(400, "Video duration not found")

    const video = await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration: videoDuration,
        owner: userId
    })

    res.status(201).json({
        success: true,
        data: video,
    })

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}