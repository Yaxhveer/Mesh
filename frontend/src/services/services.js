export const register = async (email, password) => {
    const user = {email: email, password: password};
    try {
        const res = await fetch (`/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
            credentials: 'include'
        });
        const data = await res.json();
        if (data.done) sessionStorage.setItem('userID', data.user_id);
        
        return data;
    } catch (e) {
        console.log(e);
    }
}

export const login = async (email, password) => {
    const user = {email: email, password: password};
    try {
        const res = await fetch (`/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
            credentials: "include"
        });
        console.log(res);
        const data = await res.json();
        if (data.done) sessionStorage.setItem('userID', data.user_id);

        return data;
    } catch (e) {
        console.log(e);
    }
};

export const logout = async () => {
    try {
        const res = await fetch (`/api/auth/logout`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: 'include'
        });
        const data = await res.json();
        if (data.done) sessionStorage.clear();
        return data;
    } catch (e) {
        console.log(e);
    }
}

export const getUserData = async (userID) => {
    try {
        const res = await fetch (`/api/profile/${userID}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }, 
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (e) {
        console.log(e);
    }
}

export const getPostData = async (userID) => {
    try {
        const res = await fetch (`/api/post/${userID}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }, 
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (e) {
        console.log(e);
    }
}

export const getComments = async (postID) => {
    try {
        const res = await fetch (`/api/post/comments/${postID}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }, 
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (e) {
        console.log(e);
    }
}

export const commentPost = async (postID, userID, comment) => {
    console.log(comment);
    const body = {postID : postID, userID: userID, comment: comment};
    try {
        const res = await fetch (`/api/post/comment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify(body),
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (e) {
        console.log(e);
    }
}

export const uncommentPost = async (postID, userID) => {
    const body = {postID : postID, userID: userID};
    try {
        const res = await fetch (`/api/post/uncomment`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify(body),
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (e) {
        console.log(e);
    }
}

export const likePost = async (postID, userID) => {
    const body = {postID : postID, userID: userID};
    try {
        const res = await fetch (`/api/post/like`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify(body),
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (e) {
        console.log(e);
    }
}

export const unlikePost = async (postID, userID) => {
    const body = {postID : postID, userID: userID};
    try {
        const res = await fetch (`/api/post/unlike`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },  
            body: JSON.stringify(body),
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (e) {
        console.log(e);
    }
}

export const deletePost = async (postID) => {
    try {
        const res = await fetch (`/api/post/delete/${postID}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },  
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (e) {
        console.log(e);
    }
}

export const follow = async (otherID, userID) => {
    const body = {otherID : otherID, userID: userID};
    try {
        const res = await fetch (`/api/profile/follow`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },  
            body: JSON.stringify(body),
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (e) {
        console.log(e);
    }
}

export const unfollow = async (otherID, userID) => {
    const body = {otherID : otherID, userID: userID};
    try {
        const res = await fetch (`/api/profile/unfollow`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },  
            body: JSON.stringify(body),
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (e) {
        console.log(e);
    }
}

export const recommendation = async (userID) => {
    try {
        const res = await fetch (`/api/profile/recommendation/${userID}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (e) {
        console.log(e);
    }
}

export const following = async (userID) => {
    try {
        const res = await fetch (`/api/profile/following/${userID}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (e) {
        console.log(e);
    }
}

export const createPost = async (formData) => {
    try {
        const res = await fetch (`/api/post/create`, {
            method: "POST",
            body: formData,
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (e) {
        console.log(e);
    }
}

export const followingFeed = async (userID) => {
    try {
        const res = await fetch (`/api/post/followingFeed/${userID}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (e) {
        console.log(e);
    }
}

export const feed = async (userID) => {
    try {
        const res = await fetch (`/api/post/feed/${userID}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (e) {
        console.log(e);
    }
}

export const editProfile = async (formData) => {
    try {
        const res = await fetch (`api/profile/edit`, {
            method: "POST",
            credentials: 'include',
            body: formData
        });
        const data = await res.json();
        return data;
    } catch (e) {
        console.log(e);
    }
}