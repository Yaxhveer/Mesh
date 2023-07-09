import { useEffect, useRef, useState } from "react";
import { getUserData, getPostData, follow, unfollow, deletePost, likePost } from "../../services/services";
import { useAuth } from "../context/authContext";
import PostLayout from "../post/postLayout";
import { useNavigate, useParams } from "react-router-dom";

export default function ProfileLayout () {
    
    const [ loading, setLoading ] = useState(true);
    const [ userData, setUserData ] = useState();
    const [ postData, setPostData ] = useState();
    const following = useRef();
    const { userID } = useParams();
    const { currUser, error, setError, currUserInfo } = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{ 
        setError('');
        const fetchData = async () => {
            if (userID === currUser) setUserData(currUserInfo);
            else {
                const user = await getUserData(userID);
                if (user.done) {
                    setUserData(user.data);
                    following.current = user?.data?.followers.includes(currUser);
                }
                else setError(user.msg);
            }     
            const post = await getPostData(userID);
            if (post.done) setPostData(post);
            else setError(post.msg);
        };
        fetchData();
        setLoading(false);
    }, [userID]);

    const handleDeletePost = async (postID) => {
        setLoading(true);
        try{
            const data = await deletePost(postID);
            if (!data?.done) setError("Task Failed");
            else {
                const posts = postData.data.filter(x => x.post_id !== postID);
                const likes = postData.liked.filter(x => x !== postID);
                setPostData({...postData, data: [...posts], liked: [...likes]});
            }
        } catch (e) {
            console.log(e.message);
            setError("Task didn't complete");
        }
        setLoading(false);
    };

    const handleFollow = async () => {
        setLoading(true);
        try{
            const data = await follow(userData?.user_id, currUser);
            if (!data?.done) setError("Task Failed.");
            else {
                following.current = true;
                userData?.followers.push(currUser);
                console.log(userData);
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
                following.current = false;
                const newFollowers = userData?.followers.filter(x => x!==currUser);
                setUserData({...userData, followers: newFollowers});
                
                console.log(userData);
            }
        } catch (e) {
            console.log(e.message);
            setError("Task didn't complete");
        }
        setLoading(false);
    };

    return( !loading && 
        <div className={"flex flex-col items-center mx-4 overflow-auto scrollbar-hide relative " + ( error ? "h-[calc(100vh-121.33px)] " : "h-[calc(100vh-53.33px)]" )}>
            <div className="w-full flex flex-row ss:gap-x-8 xs:gap-x-4 gap-x-2 border-b-2 dark:border-gray-200 border-gray-700 my-2 p-2 justify-center items-center ss:max-w-sm max-w-xs" >
                <div className="flex ss:w-24 ss:h-24 w-[72px] h-[72px] justify-center items-center text-gray-950 dark:text-gray-50">
                    { userData?.avatar ? 
                    <img src= {`/api/${userData?.avatar}`} className="ss:w-[78px] ss:h-[78px] w-[58.5px] h-[58.5px] object-contains rounded-full"/>
                    : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ss:w-24 ss:h-24 w-[72px] h-[72px] fill-gray-950 dark:fill-gray-50">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>

                    }
                </div> 
                <div className="grow flex flex-col justify-center ss:text-sm text-xs dark:text-gray-200 ss:font-medium font-light">
                    <div className="ss:font-semibold font-medium ss:text-2xl text-lg">{userData?.user_name}</div>
                    <div className="flex flex-row ss:gap-x-4 gap-x-2 flex-wrap">
                        <div>{userData?.followers.length} followers</div>
                        <div>{userData?.following.length} following</div>
                    </div>
                    <div>{userData?.display_name}</div>
                    <div>{userData?.about}</div>
                </div>
                
                <div className="text-gray-800 dark:text-gray-200 hover:bg-cyan-200 dark:hover:bg-gray-700 focus:outline-none rounded-full text-sm p-2.5">
                    { (currUser === parseInt(userID)) ?
                        <button onClick={() => navigate('/editProfile')} >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
                            </svg>
                        </button> 
                        : ( following.current ? 
                                <button onClick={handleUnfollow} disabled={loading}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path d="M10.375 2.25a4.125 4.125 0 100 8.25 4.125 4.125 0 000-8.25zM10.375 12a7.125 7.125 0 00-7.124 7.247.75.75 0 00.363.63 13.067 13.067 0 006.761 1.873c2.472 0 4.786-.684 6.76-1.873a.75.75 0 00.364-.63l.001-.12v-.002A7.125 7.125 0 0010.375 12zM16 9.75a.75.75 0 000 1.5h6a.75.75 0 000-1.5h-6z" />
                                    </svg>
                                </button>
                            : 
                                <button onClick={handleFollow} disabled={loading}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z" />
                                    </svg>
                                </button>
                        )
                    }
                </div>

            </div>
            <div className="w-full h-full overflow-scroll grid p-2 sm:p-8 sm:gap-8 pt-4 gap-4 justify-items-center scrollbar-hide">
               { 
                postData?.data?.map((post, index) => {
                    return (<PostLayout postData={post} likedPost={postData.liked} handleDeletePost={handleDeletePost} key={index} />);
                })
               }
            </div>
        </div>
    );
}