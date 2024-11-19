'use server'
interface User {

    email: string,
    userName?: string,
    password: string,
    fullName?: string,
    avatar?: object,
    coverImage?: object
}

export const Sigin = async ({ email, password }: User) => {
    try {
        // console.log(JSON.stringify({ e?mail, password })); // Log the request payload

        const response = await fetch('http://localhost:8000/api/v1/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email:email, password:password }),
        });
        console.log('Raw Response:', response);

        if (!response.ok) {
            // Handle errors from the server
            const errorData = await response.json(); // Parse error message
            console.error('Server Error:', errorData);
            throw new Error(errorData.message || 'Login failed');
        }

        const data = await response.json(); // Parse successful response
        console.log('Response Data:', data);
        return data; // Return parsed data to the caller
    } catch (error: any) {
        console.error('Network/Other Error:', error.message || error);
        throw error; // Re-throw for caller to handle
    }
};

export const SignUp = async ({ fullName, email, userName, password, avatar, coverImage }: User) => {

    try {
        const response = await fetch('http://localhost:8000/api/v1/users/register', {
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
        const response = await fetch('http://localhost:8000/api/v1/users/logout', {
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
        const response = await fetch('http://localhost:8000/api/v1/users/refresh-token', {
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
        const response = await fetch('http://localhost:8000/api/v1/users/change-password', {
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
        const response = await fetch('http://localhost:8000/api/v1/users/current-user', {
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
        const response = await fetch('http://localhost:8000/api/v1/users/update-account', {
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
        const response = await fetch('http://localhost:8000/api/v1/users/avatar', {
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
        const response = await fetch('http://localhost:8000/api/v1/users/coverImage', {
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
        const response = await fetch(`http://localhost:8000/api/v1/users/c/${userName}`, {
            method: 'GET'
        })
        console.log(response)
        return response
    } catch (error) {
        console.log(error)
    }
}

export const WatchHistory = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/v1/users/history', {
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