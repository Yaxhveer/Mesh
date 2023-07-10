import { useEffect, useState } from "react";
import { follow, unfollow } from "../../services/services";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export default function UserLayout ({ userData, postID, handleDeletePost }) {

    const { setError, currUserInfo, currUser, setCurrUserInfo } = useAuth();
    const [ following, setFollowing ] = useState();
    const [ loading, setLoading ] = useState(false);
    const navigate = useNavigate();

    useEffect (()=>{
        setFollowing(currUserInfo?.following?.includes(userData?.user_id));
    }, [])
    
    const handleFollow = async () => {
        setLoading(true);
        try{
            const data = await follow(userData?.user_id, currUser);
            if (!data?.done) setError("Task Failed.");
            else {
                setFollowing(true);
            }
        } catch (e) {
            console.log(e.message);
            setError("Task didn't complete");
        }
        setLoading(false);
    };

    const handleUnfollow = async () => {
        setLoading(true);
        try{
            const data = await unfollow(userData?.user_id, currUser);
            if (!data?.done) setError("Task Failed.");
            else {
                setFollowing(false);                
                console.log(userData);
            }
        } catch (e) {
            console.log(e.message);
            setError("Task didn't complete");
        }
        setLoading(false);
    };

    if (postID) {
        return (
            <div className="flex flex-row justify-between items-center">

                <div className="flex flex-row gap-4 items-center">           
                    <div className="ss:w-8 ss:h-8 w-6 h-6 rounded-full text-gray-800 dark:text-gray-300" onClick={() => navigate(`/profile/${userData?.user_id}`)}>
                        { userData?.avatar ? 
                            <img src= {`/api/${userData.avatar}`} className="ss:w-8 ss:h-8 w-6 h-6 object-contains rounded-full"/>
                            : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="ss:w-8 ss:h-8 w-6 h-6">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                            </svg>

                        }
                    </div>
                    <div className="flex flex-col">
                        <div className="text-xl font-bold dark:text-gray-200">{userData?.user_name || "yash"}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{userData?.display_name || "yash"}</div>
                    </div>
                </div>
                { (currUser === userData?.user_id) &&
                    <button className="ss:w-6 ss:h-6 w-4 h-4 text-gray-800 dark:text-gray-200" onClick={() => handleDeletePost(postID)} disabled={loading}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                } 
            </div>
        )
    }
    
    else {
        return (
            <div className="flex flex-row gap-2 justify-between items-center ">
                <div className="flex flex-row gap-4 items-center overflow-x-auto scrollbar-hide">           
                    <div className="ss:w-8 ss:h-8 w-6 h-6 rounded-full text-gray-800 dark:text-gray-200" onClick={() => navigate(`/profile/${userData?.user_id}`)}>
                        { userData?.avatar ? 
                            <img src= {`/api/${userData.avatar}`} className="ss:w-8 ss:h-8 w-6 h-6 object-contains rounded-full"/>
                            : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="ss:w-8 ss:h-8 w-6 h-6">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                            </svg>
                        }
                    </div>
                    <div className="flex flex-col">
                        <div className="text-xl font-bold dark:text-gray-200 ">{userData?.user_name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{userData?.display_name}</div>
                    </div>
                </div>
                { currUser !== userData?.user_id && 
                    ( (following ? 
                        <button onClick={handleUnfollow} className="ss:w-6 ss:h-6 w-4 h-4 text-gray-800 dark:text-gray-200" disabled={loading}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                            </svg>
                        </button>
                    : 
                        <button className="ss:w-6 ss:h-6 w-4 h-4 text-gray-800 dark:text-gray-200" onClick={handleFollow} disabled={loading}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ss:w-6 ss:h-6 w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                            </svg>
                        </button> 
                    ))
                } 

            </div>
        )
    }
}