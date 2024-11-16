import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiErrors.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    try {
        const { name, description, } = req.body
        const { userId } = req.user?.id

        if (!isValidObjectId(userId))
            throw new ApiError(400, "Invalid userId");

        const playlist = await Playlist.create({
            name,
            description,
            owner: userId
        })
        if (!playlist) throw new ApiError(400, "Playlist not created")

        return res.status(200).json(new ApiResponse(200, playlist, "Playlist created"))
    } catch (error) {
        throw new ApiError(500, "Error while creating playlist")
    }
    //TODO: create playlist
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params
        //TODO: get user playlists
        if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid userId")
        const userPlaylist = await Playlist.find({ owner: userId })

        if (!userPlaylist) throw new ApiError(404, "User has no playlists")

        return res.status(200).json(new ApiResponse(200, userPlaylist, "User playlists"))
    } catch (error) {
        throw new ApiError(500, "Error while getting user playlists")
    }

})

const getPlaylistById = asyncHandler(async (req, res) => {
    try {
        const { playlistId } = req.params

        if (!isValidObjectId(playlistId)) throw new ApiError(400, "Invalid playlistId")
        const getPlaylistbyId = await Playlist.findById(playlistId)

        if (!getPlaylistbyId) throw new ApiError(404, "Playlist not found")

        return res.status(200).json(new ApiResponse(200, getPlaylistbyId, "Playlist found"))
        //TODO: get playlist by id
    } catch (error) {
        throw new ApiError(500, "Error while getting playlist by id")
    }
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {

    try {
        const { playlistId, videoId } = req.params

        if (!isValidObjectId(playlistId) || !isValidObjectId(videoId))
            throw new ApiError(400, "Invalid playlistId or videoId");

        const addVideoToPlaylist = await Playlist.findByIdAndUpdate(playlistId, { $push: { videos: videoId } }, { new: true })
        if (!addVideoToPlaylist) throw new ApiError(404, "Playlist not found")
        return res.status(200).json(new ApiResponse(200, addVideoToPlaylist, "Video added to playlist"))

        // TODO: add video to playlist

    } catch (error) {
        throw new ApiError(500, "Error while adding video to playlist")
    }

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    try {
        const { playlistId, videoId } = req.params

        if (!isValidObjectId(playlistId) || !isValidObjectId(videoId))
            throw new ApiError(400, "Invalid playlistId or videoId");

        const removeVideoToPlaylist = await Playlist.findByIdAndUpdate(playlistId, { $pull: { videos: videoId } }, { new: true })
        if (!removeVideoToPlaylist) throw new ApiError(404, "Playlist not found")
        return res.status(200).json(new ApiResponse(200, removeVideoToPlaylist, "Video removed to playlist"))

        // TODO: remove video from playlist
    } catch (error) {
        throw new ApiError(500, "Error while adding video to playlist")
    }

})

const deletePlaylist = asyncHandler(async (req, res) => {
    try {
        const { playlistId } = req.params
        if (!isValidObjectId(playlistId)) throw new ApiError(400, "Invalid playlistId")
        const deletePlaylist = await Playlist.findByIdAndDelete(playlistId)
        if (!deletePlaylist) throw new ApiError(404, "Playlist not found")
        return res.status(200).json(new ApiResponse(200, deletePlaylist, "Playlist deleted"))
        // TODO: delete playlist
    } catch (error) {
        throw new ApiError(500, "Error while deleting playlist")
    }
})

const updatePlaylist = asyncHandler(async (req, res) => {
    try {
        const { playlistId } = req.params
        const { name, description } = req.body
        //TODO: update playlist
        if (!isValidObjectId(playlistId)) throw new ApiError(400, "Invalid playlistId")
        const updatePlaylist = await Playlist.findByIdAndUpdate(playlistId, { name, description }, { new: true })
        if (!updatePlaylist) throw new ApiError(404, "Playlist not found")
        return res.status(200).json(new ApiResponse(200, updatePlaylist, "Playlist updated"))
    } catch (error) {

    }
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}