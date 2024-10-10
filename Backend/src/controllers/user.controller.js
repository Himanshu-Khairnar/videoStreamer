import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiErrors.js'
import { User } from '../models/user.model.js'
import { OldImagetoDelete, uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from "jsonwebtoken"
import mongoose from 'mongoose'

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Access and Refresh Token not generated")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, userName, email, password } = req.body;


    if ([fullName, userName, email, password].some((field) => field === '')) {
        throw new ApiError(400, "All fields are requried")

    }

    const exisitingUser = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (exisitingUser)
        throw new ApiError(409, "Already user exists")

    const avatarLocalPath = req.files?.avatar[0]?.path

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files?.coverImage[0]?.path
    }


    if (!avatarLocalPath)
        throw new ApiError(400, "Avatar is required ")

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    let coverImage = uploadOnCloudinary(coverImageLocalPath)


    if (!avatar.url)
        throw new ApiError(400, "Avatar is required ")

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase()

    })

    const isCreated = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!isCreated)
        throw new ApiError(500, "Error in creating User")

    return res.status(201).json(
        new ApiResponse(200, isCreated, "User Registered Successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    //taking credentials from frontend
    //checcking email in the db is there
    // checking password is correct 
    //access token and refresh token
    //send cookie

    const { email, userName, password } = req.body

    if (!userName && !email) {
        throw new ApiError(400, "Email and UserName fields are required")
    }

    const user = await User.findOne({
        $or: [{ userName }, { email }]
    })
    if (!user) {
        throw new ApiError(404, "User does not exist")
    }


    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid)
        throw new ApiError(400, "Password is not correct")

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedinUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.
        status(200).
        cookie("refreshToken", refreshToken, options).
        cookie("accessToken", accessToken, options).
        json(new ApiResponse
            (
                200,
                {
                    user: loggedinUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true,
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200).clearCookie("refreshToken", options).clearCookie("accessToken", options).json(new ApiResponse(200, {}, { message: "User logged out successfully" }))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken)
        throw new ApiError(401, 'Unauthorized')


    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)


        const user = await User.findById(decodedToken._id)

        if (!user)
            throw new ApiError(401, 'Unauthorized Request')

        if (incomingRefreshToken !== user.refreshToken)
            throw new ApiError(401, 'Refresh Token is used')

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
        return res.
            status(200).
            cookie("accessToken", accessToken).
            cookie("refreshToken", refreshToken, options).
            json(
                new ApiResponse(200,
                    { accessToken, refreshToken },
                    "Access Token Refresh Successfully")
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Something went wrong with refresh token")
    }
})

const changecurrentPassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(currentPassword)

    if (!isPasswordCorrect)
        throw new ApiError(400, "Current Password is not correct")


    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res.status(200).json(new ApiResponse(200, {}, "Password Changed Successfully"))

})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "User found"))
})

const updateAccountDetails = asyncHandler(asyncHandler(async (req, res) => {
    const { fullName, email } = req.body

    if (!fullName || !email)
        throw new ApiError(400, "Full name and email fields are required")

    await User.findByIdAndUpdate
        (
            req.user?._id,
            {
                $set: {
                    fullName,
                    email
                }
            },
            { new: true }
        ).select("-password ")

    return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"))
})
)

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath)
        throw new ApiError(400, "Avatar is required")

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar.url)
        throw new ApiResponse(400, "Avatar not uploaded")


    const userDetail = await User.findById(req.user?._id)
    const oldAvatar = userDetail.avatar

    const updatedAvatar = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            avatar: avatar.url
        }
    }, { new: true }).select("-password ")

    await OldImagetoDelete(oldAvatar)

    return res.status(200).json(new ApiResponse(200, updatedAvatar, "Avatar updated successfully"))
})

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath)
        throw new ApiError(400, "Cover Image is required")

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!avatar.url)
        throw new ApiResponse(400, "Cover Image not uploaded")

    const userDetail = await User.findById(req.user?._id)
    const oldCoverImage = userDetail.avatar
    const updatedCoverImage = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            coverImage: coverImage.url
        }
    }, { new: true }).select("-password ")

    await OldImagetoDelete(oldCoverImage)

    return res.status(200).json(new ApiResponse(200, updatedCoverImage, "Cover Image Updated Successfully"))
})

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { userName } = req.params

    if (!userName.trim())
        throw new ApiError(400, "User name not found")

    const channel = await User.aggregate([
        {

            $match: {
                userName: userName?.toLowerCase()
            },
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            },
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscriptions"
            }
        },
        {
            $addFields: {
                subscribersCount: { $size: "$subscribers" },
                subscriptionsCount: { $size: "$subscriptions" },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                userName: 1,
                subscribersCount: 1,
                subscriptionsCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }

    ])
    if (!channel?.length)
        throw new ApiError(404, "Channel not found")

    return res.
        status(200).
        json(new ApiResponse(200, channel[0], "User Channel"))
})

const getWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        userName: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    }
                    , {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])
    return res.return.status(200).json(new ApiResponse(200, user[0].WatchHistory, "Watch History"))
})

export { registerUser, loginUser, logoutUser, refreshAccessToken, changecurrentPassword, getCurrentUser, updateAccountDetails, updateUserCoverImage, updateUserAvatar, getUserChannelProfile, getWatchHistory }