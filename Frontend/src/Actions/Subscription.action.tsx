
export const GetSubscribedChannels = async (channelID: string) => {
    try {
        const response = await fetch(`http://localhost:8000/api/v1/subscriptions/c/${channelID}`, {
            method: 'GET',
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const ToggleSubscription = async (channelId: string) => {
    try {
        const response = await fetch(`http://localhost:8000/api/v1/subscriptions/c/${channelId}`, {
            method: 'GET',
        })
        console.log(response)
        return response
    } catch (error) {   
        console.log(error)
    }
}

export const GetUserChannelSubscription = async(subscriberId:string)=>{
    try {
        const response = await fetch(`http://localhost:8000/api/v1/subscriptions/u/${subscriberId}`, {
            method: 'GET',
        })   
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}