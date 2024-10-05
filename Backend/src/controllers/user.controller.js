import { asyncHandler } from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiErrors.js'
import {User} from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'
const registerUser = asyncHandler(async (req, res) => {
    const { fullName, userName, email, password } = req.body;
    console.log("Email:", email)


    if([fullName,userName,email,password].some((field)=>field.trim()===''))
    {
        throw new ApiError(400,"All fields are requried")

    }

    const exisitingUser = User.findOne({ 
        $or: [{userName},{email}]
    })

    if(exisitingUser)
        throw new ApiError(409,"Already user exists")

    const avatarLocalPath=req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath)
        throw new  ApiError(400,"Avatar is required ")

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar.url)
        throw new ApiError(400, "Avatar is required ")

    const user =await User.create({
        fullName,
        avatar  : avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName:userName.toLowerCase()

    })

    const isCreated = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!isCreated)
        throw new ApiError(500,"Error in creating User")

    return res.status(201).json(
        new ApiResponse(200,isCreated,"User Registered Successfully")
    )
})


export { registerUser }