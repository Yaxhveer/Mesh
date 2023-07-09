import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { commentPost, getComments, getUserData, likePost, unlikePost } from "../../services/services";
import { useAuth } from "../context/authContext";
import Comments from "./comments";
import UserLayout from "../layout/userLayout";

export default function PostLayout ({ postData, likedPost, handleDeletePost }) {

    const [ userData, setUserData ] = useState();
    const [ liked, setLiked ] = useState();
    const [ comments, setComments ] = useState();
    const [ userComment, setUserComment ] = useState();
    const [ showComment, setShowComment ] = useState(false);
    const [ loading, setLoading ] = useState(true);
    const { currUser, setError, currUserInfo } = useAuth();
    
    useEffect(()=>{
        const fetchUserData = async () => {
            const data = await getUserData(postData.user_id);
            if (!data.done) {
                setError("Task Failed.");
                return;
            }
            setUserData(data.data);
        }
        fetchUserData();
        console.log(postData);
        setLiked(likedPost?.includes(postData?.post_id)); 
        setLoading(false);
    }, []);

    const handlePostLike = async () => {
        setLoading(true);
        try{
            let data;
            if (!liked) data = await likePost(postData?.post_id, currUser);
            else data = await unlikePost(postData?.post_id, currUser);

            if (!data.done) setError("Task Failed.");
            else {
                if (!liked) {
                    likedPost.push(currUser);
                    postData.likes++;
                }
                else {
                    likedPost = likedPost.filter(x => x!==postData?.post_id);
                    postData.likes--;
                }
                setLiked(!liked);
            }
        } catch (e) {
            console.log(e.message);
            setError("Task didn't complete");
        }
        setLoading(false);
    };

    const handlePostComment = async () => {
        setLoading(true);
        try{
            const data = await commentPost(postData?.post_id, currUser, userComment);
            if (!data?.done) setError("Task Failed.");
            else setComments([...comments, {comment: userComment, avatar: currUserInfo.avatar, user_name: currUserInfo.user_name}]);
        } catch (e) {
            console.log(e.message);
            setError("Task didn't complete");
        }
        setLoading(false);
    };

    const handleShowComment = async () => {
        setShowComment(!showComment);
        const data = await getComments(postData?.post_id);
        console.log(data);
        if (!data.done) setError("Task Failed.");
        else setComments(data.data);
    }

    return ( !loading &&

        <div className="flex flex-col xs:p-4 py-2 px-4 w-full max-w-[300px] xs:gap-4 gap-2 bg-gray-300 dark:bg-gray-700 rounded-2xl h-min max-h-[560px]">
            <UserLayout 
                userData={userData}
                postID={postData?.post_id} 
                handleDeletePost={handleDeletePost}
                setUserData={setUserData}
            />

            <div className="text-gray-800 dark:text-gray-200 hyphens-auto overflow-auto scrollbar-hide">
                { postData?.about }
            </div>
            <div className="">
                <img src={`../api/${postData.post}`} className="object-scale-down"/>
            </div>
            <div className="flex flex-col gap-0.5 ">
                <div className="flex flex-row gap-4 text-gray-800 dark:text-gray-200">
                    <div onClick={handlePostLike}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={liked ? "fill-red-700 w-6 h-6 text-red-700" : "w-6 h-6 "}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                    </div>
                    <div onClick={handleShowComment}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                        </svg>
                    </div>
                </div>
                <div className="translate-x-1 text-gray-800 dark:text-gray-200">
                    {postData?.likes || 0} likes
                </div>
            </div>
            <Comments comments={comments}
                      showComment={showComment}
                      handlePostComment={handlePostComment}
                      loading={loading}
                      setUserComment={setUserComment}
            /> 
        </div>
    );
};