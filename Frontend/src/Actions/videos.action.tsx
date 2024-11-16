
export const getVideos = async () => {
    const response = await fetch('https://localhost:8000/api/v1/videos' , {
        method: 'GET'
    })
}