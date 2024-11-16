
export const HealthCheckUp = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/v1/healthcheck', {
            method: 'GET'
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const GetChannelStats = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/v1/dashboard/status', {
            method: 'GET'
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const GetChannelsVideos = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/v1/dashboard/videos', {
            method: 'GET'
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}