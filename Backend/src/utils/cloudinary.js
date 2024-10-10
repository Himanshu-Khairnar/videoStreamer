import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import { ApiError } from "./ApiErrors.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        //upload on cloundinary
        const response = cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        console.log(response)
        console.log("file  has been uploaded on cloudinary", response.url)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove locally saved path
    }
}

const getPublicIdFromUrl = (url) => {
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    const publicIdWithExtension = parts.slice(uploadIndex + 2).join('/');
    const publicId = publicIdWithExtension.split('.')[0];
    return publicId;
};

const OldImagetoDelete = async (url) => {
    const publicId = getPublicIdFromUrl(url);

    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        throw new ApiError(500, "Error while deleting image from Cloudinary");
    }
}
export { uploadOnCloudinary, OldImagetoDelete }

