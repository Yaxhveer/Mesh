import { useEffect, useState } from "react";
import PostLayout from "../post/postLayout";
import { feed, followingFeed, deletePost } from "../../services/services";
import { useAuth } from "../context/authContext";

export default function Feed () {

    const [ feedPost , setFeedPost ] = useState();
    const [ followingPost, setFollowingPost ] = useState(true);
    const [ loading, setLoading ] = useState(true);
    const { currUser, setError } = useAuth();

    useEffect (() => {
        const fetchData = async () => {
            let data;
            if (followingPost) {
                data = await followingFeed(currUser);
            } else {
                data = await feed(currUser);
            }
            console.log(data);
            if (!data.done) setError("Task Failed");
            else setFeedPost(data)
        }
        fetchData();
        setLoading(false);
    }, [followingPost])

    const handleDeletePost = async (postID) => {
        setLoading(true);
        try{
            const data = await deletePost(postID);
            if (!data?.done) setError("Task Failed");
            else {
                const posts = feedPost.data.filter(x => x.post_id !== postID);
                const likes = feedPost.liked.filter(x => x !== postID);
                setFeedPost({...feedPost, data: [...posts], liked: [...likes]});
            }
        } catch (e) {
            console.log(e.message);
            setError("Task didn't complete");
        }
        setLoading(false);
    };

    return ( !loading &&
        <div className="flex flex-col gap-4 items-center overflow-auto scrollbar-hide">
            <div className="px-4  max-w-[280px] w-full">
                <div className="flex xs:flex-row flex-col w-full rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 ">
                    <div onClick={()=>setFollowingPost(true)}  className={"w-full xs:text-right text-center pb-1 xs:py-1 border-b border-r-0 xs:border-b-0 xs:pr-4 xs:border-r border-slate-700 dark:border-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700  xs:hover:rounded-s-2xl rounded-t-2xl xs:rounded-r-none xs:rounded-l-2xl " + (followingPost ? "bg-slate-300 dark:bg-slate-700 " : "")}>Following</div>
                    <div onClick={()=>setFollowingPost(false)}  className={"w-full xs:text-left text-center hover:bg-slate-300 dark:hover:bg-slate-700 xs:hover:rounded-e-2xl xs:rounded-b-none xs:rounded-r-2xl rounded-b-2xl xs:py-1 xs:pl-4 pl-0 pt-1 " + (!followingPost ? "bg-slate-300 dark:bg-slate-700" : "")}>Feed</div>
                </div>
            </div>
            <div className="flex flex-col gap-4 w-full items-center">
            { 
                feedPost?.data.map((post, index) => {
                    return <PostLayout 
                                key={index}
                                postData={post}
                                likedPost={feedPost?.liked}
                                handleDeletePost={handleDeletePost}
                            />
                })
            }
                
            </div>
        </div>
    );
}