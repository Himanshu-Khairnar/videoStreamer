interface User {

    email: string,
    userName: string,
    password: string,
    fullName?: string,
    avatar?: string,
    coverImage?: string
}

export const Sigin = async ({ email, userName, password }: User) => {
    try {
        const response = await fetch('https://localhost:8000/api/v1/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, userName, password })
        })
        console.log(response)
        return response
    }
    catch (error) {
        console.log(error)
    }
}
export const SignUp = async ({ fullName, email, userName, password, avatar, coverImage }: User) => {
    try {
        const response = await fetch('https://localhost:8000/api/v1/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fullName, email, userName, password, avatar, coverImage })
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }

}

export const LogOut = async () => {
    try {
        const response = await fetch('https://localhost:8000/api/v1/users/logout', {
            method: 'POST'
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const RefreshToken = async () => {
    try {
        const response = await fetch('https://localhost:8000/api/v1/users/refresh-token', {
            method: 'POST'
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const ChangePassword = async ({ currentPassword, newPassword }: { currentPassword: string, newPassword: string }) => {
    try {
        const response = await fetch('https://localhost:8000/api/v1/users/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ currentPassword, newPassword })
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const GetUser = async () => {
    try {
        const response = await fetch('https://localhost:8000/api/v1/users/current-user', {
            method: 'POST'
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const UpdateAccountDetails = async ({ email, userName, }: User) => {
    try {
        const response = await fetch('https://localhost:8000/api/v1/users/update-account', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, userName })
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const UpdateAvatar = async (avatar: string) => {
    try {
        const response = await fetch('https://localhost:8000/api/v1/users/avatar', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ avatar })
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const UpdateCoverImage = async (coverImage: string) => {
    try {
        const response = await fetch('https://localhost:8000/api/v1/users/coverImage', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ coverImage })
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const GetChannelProfile = async (userName: string) => {
    try {
        const response = await fetch(`https://localhost:8000/api/v1/users/c/${userName}`, {
            method: 'GET'
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const WatchHistory = async () =>{
    try {
        const response = await fetch('https://localhost:8000/api/v1/users/history', {
            method: 'GET'
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}

//api
//https://localhost:8000/api/v1/users