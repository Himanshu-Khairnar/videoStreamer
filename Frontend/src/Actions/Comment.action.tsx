
export const GetVideoComments = async (videoId: string) => {
    try {
        const response = await fetch(`http://localhost:8000/api/v1/comments/${videoId}`, {
            method:"GET"
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const AddComment = async ({ videoId, comment }: { videoId: string, comment: string }) => {
    try {
        const response = await fetch(`http://localhost:8000/api/v1/comments/${videoId}`, {
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({comment})
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const DeleteComment = async ({ commentId}: { commentId: string }) => {
    try {
        const response = await fetch(`http://localhost:8000/api/v1/comments/c/${commentId}`, {
            method:"DELETE"
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const UpdateComment = async ({  commentId, comment }: { commentId: string, comment: string }) => {
    try {
        const response = await fetch(`http://localhost:8000/api/v1/comments/c/${commentId}`, {
            method:"PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({comment})
        })
    } catch (error) {
        console.log(error)
    }
}