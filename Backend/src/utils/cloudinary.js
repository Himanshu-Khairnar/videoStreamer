import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

import { v2 as cloudinary } from 'cloudinary';
import { response } from "express";

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

        // file has beem uploaded successfully

        console.log("file  has been uploaded on cloudinary", response.url)
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove locally saved path
    }
}



export {uploadOnCloudinary}

