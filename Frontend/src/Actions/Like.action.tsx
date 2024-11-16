
export const toggleLike = async ({ videoId }: { videoId: string }) => {
    try {
        const response = await fetch(`http://localhost:8000/api/v1/likes/toggle/v/${videoId}`, {
            method: 'POST',
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


export const toggleLikeComment   = async ({ commentId }: { commentId: string }) => {
    try {
        const response = await fetch(`http://localhost:8000/api/v1/likes/toggle/c/${commentId}`, {
            method: 'POST',
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

export const getLikeVideos = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/v1/likes/videos', {
            method:"GET"
        })
    } catch (error) {
        
    }
}