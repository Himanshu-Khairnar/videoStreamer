import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiErrors.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'

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

const loginUser = asyncHandler(async (req, res) => {
    //taking credentials from frontend
    //checcking email in the db is there
    // checking password is correct 
    //access token and refresh token
    //send cookie

    const { email, userName, password } = req.body;

    if (!userName || !email) {
        throw new ApiError(400, "Email and UserName fields are required")
    }

    const user = User.findOne({
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
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true,
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200).clearCookie("refreshToken", options).clearCookie("accessToken", options).json(new ApiResponse(200,{},{ message: "User logged out successfully" }))   
})

 
export { registerUser, loginUser, logoutUser }