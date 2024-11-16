interface Video {
    title: string,
    description: string,
    videoFile: string,
    thumbnail: string,
    views: number,
    id: string
}
export const getVideos = async () => {
    try {
        const response = await fetch('https://localhost:8000/api/v1/videos/', {
            method: 'GET'
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}
export const publishVideo = async ({ title, description, videoFile, thumbnail }: Video) => {
    try {
        const response = await fetch('https://localhost:8000/api/v1/videos/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, videoFile, thumbnail })
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }

}
export const GetVideoByID = async (id: string) => {
    try {
        const response = await fetch(`https://localhost:8000/api/v1/videos/${id}`, {
            method: 'GET'
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}
export const DeleteVideoByID = async (id: string) => {
    try {
        const response = await fetch(`https://localhost:8000/api/v1/videos/${id}`, {
            method: 'DELETE'
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}
export const UpdateVideo = async ({ id, title, description, thumbnail }: Video) => {
    try {
        const respnse = await fetch(`https://localhost:8000/api/v1/videos/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, thumbnail })
        })
        console.log(respnse)
        return respnse
    } catch (error) {
        console.log(error)
    }
}

export const DeleteVideo = async ({ id}: Video) => {
    try {
        const respnse = await fetch(`https://localhost:8000/api/v1/videos/${id}`, {
            method: 'DELETE '
        })
        console.log(respnse)
        return respnse
    } catch (error) {
        console.log(error)
    }
}
export const TogglePulish = async ({ id }: Video) => {
    try {
        const respnse = await fetch(`https://localhost:8000/api/v1/videos/toggle/publish/${id}`, {
            method: 'PATCH'
        })
        console.log(respnse)
        return respnse
    } catch (error) {
        console.log(error)
    }
}

