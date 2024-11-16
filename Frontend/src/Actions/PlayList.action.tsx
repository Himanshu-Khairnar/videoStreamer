
export const CreatePlayList = async ({ name, description }: { name: string, description: string }) => {
    try {
        const response = await fetch('http://localhost:8000/api/v1/playlist/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description })
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const GetUserPlaylist = async (userId: string) => {
    try {
        const response = await fetch(`http://localhost:8000/api/v1/playlist/user/${userId}`, {
            method: 'GET'
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const GetPlaylistById = async (id: string) => {
    try {
        const response = await fetch(`http://localhost:8000/api/v1/playlist/${id}`, {
            method: 'GET'
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const addVideos = async ({ videoId, playlistId }: { videoId: string, playlistId: string }) => {
    try {
        const response = await fetch(`http://localhost:8000/api/v1/playlist/add/${videoId}/${playlistId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const removeVideo = async ({ videoId, playlistId }: { videoId: string, playlistId: string }) => {
    try {
        const response = await fetch(`http://localhost:8000/api/v1/playlist/remove/${videoId}/${playlistId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const DeletePlaylistById = async (id: string) => {
    try {
        const response = await fetch(`http://localhost:8000/api/v1/playlist/${id}`, {
            method: 'GET'
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const UpdatePlayList = async ({ id, name, description }: { id: string, name: string, description: string }) => {
    try {
        const response = await fetch(`http://localhost:8000/api/v1/playlist/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description })
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}