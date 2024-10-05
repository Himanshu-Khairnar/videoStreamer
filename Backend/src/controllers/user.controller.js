import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiErrors.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
const registerUser = asyncHandler(async (req, res) => {
    const { fullName, userName, email, password } = req.body;
    console.log("Email:", email)


    if ([fullName, userName, email, password].some((field) => field === '')) {
        throw new ApiError(400, "All fields are requried")

    }

    const exisitingUser = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (exisitingUser)
        throw new ApiError(409, "Already user exists")

    console.log("h")
    const avatarLocalPath = req.files?.avatar[0]?.path

    let coverImageLocalPath; 
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files?.coverImage[0]?.path
        console.log(avatarLocalPath) || ""
    }


    if (!avatarLocalPath)
        throw new ApiError(400, "Avatar is required ")

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    let coverImage = uploadOnCloudinary(coverImageLocalPath)


    console.log(avatar)
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


export { registerUser }