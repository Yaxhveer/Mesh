import { useAuth } from "../context/authContext";
import PostLayout from "../post/postLayout";
import { useEffect, useState } from "react";
import UserLayout from "./userLayout";
import { createPost, recommendation, following } from "../../services/services";
import Feed from "./feed";
import { useNavigate } from "react-router-dom";

export default function Home () {

    const [ loading, setLoading ] = useState(true);
    const [ userRecommendation, setUserRecommendation ] = useState();
    const [ followingUsers, setFollowingUsers ] = useState();
    const [ about, setAbout ] = useState("");
    const [ selectedImage, setSelectedImage ] = useState();
    const { currUser, currUserInfo, setError, error } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setError();
        const fetchData = async () => {
            const recUser = await recommendation(currUser);
            const follUser = await following(currUser);

            if (!recUser.done) setError("Task Failed.");
            else setUserRecommendation(recUser.data);
            
            if (!follUser.done) setError("Task Failed");
            else setFollowingUsers(follUser.data);
        };
        fetchData();
        setLoading(false);
    }, [])

    const handlePostSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("userID", currUser);

            if (selectedImage) formData.append("post", selectedImage);
            if (about) formData.append("about", about);
            console.log(formData);
            const data = await createPost(formData);
            if (!data.done) setError("Task Failed");
            else {
                setAbout();
                setSelectedImage();
            }
        } catch (e) {
            console.log(e);
        }
        setLoading(false);
    }

    return ( !loading &&
        <div className={"flex justify-center w-full " + ( error ? "h-[calc(100vh-121.33px)] " : "h-[calc(100vh-53.33px)]" )}>
            <div className="flex flex-row justify-center gap-8 w-full md:max-w-5xl sr:max-w-xl max-w-[320px] min-h-min mx-8 pt-4 h-full">
                <div className="md:flex hidden flex-col gap-2 bg-slate-100 dark:bg-slate-800 max-w-[240px] w-full p-4 rounded-lg max-h-56"> 
                    <UserLayout 
                        userData={currUserInfo}
                    />
                    <div className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium pl-1 border-t pt-2 border-slate-700 dark:border-slate-200">
                        <div className="text-slate-800 dark:text-slate-200 text-xl">{currUserInfo?.about || "Yppp"}</div>
                        <div className="flex flex-col gap-x-2 flex-wrap">
                            <div>{currUserInfo?.followers?.length} followers</div>
                            <div>{currUserInfo?.following?.length} following</div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 w-full sr:min-w-[280px] overflow-auto scrollbar-hide"> 
                    <div className="flex flex-col bg-slate-100 dark:bg-slate-800 p-4 rounded-lg gap-2 ">
                        <div className="flex flex-row gap-4 pb-2 border-b border-slate-300 dark:border-slate-700">
                            <div className="w-12 h-10 rounded-full">
                                { currUserInfo?.avatar ? 
                                    <img src= {`/api/${currUserInfo.avatar}`} className="w-10 h-10 object-contains rounded-full"/>
                                    : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 dark:fill-white">
                                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                    </svg>
                                }
                            </div>
                            <input value={about} onChange={(e) => setAbout(e.target.value)} className="rounded-full w-full bg-slate-200 text-sm pl-4 pr-4" placeholder="What's on your mind?"></input>
                        </div>
                        <div className="flex flex-col gap-2 px-2 overflow-auto">
                            { selectedImage && 
                                <div className="flex flex-col w-full items-end">
                                    <img className="bg-black " alt="NOT FOUND" src={URL.createObjectURL(selectedImage)} />
                                    
                                    <button onClick={() => setSelectedImage(false)} disabled={loading} className="text-xs text-sky-700 dark:text-sky-200 w-14">Remove</button>
                                </div>
                            }
                            <div className="flex flex-row text-xs text-slate-700 dark:text-slate-300 gap-2 justify-end">
                                <div className="flex flex-row gap-0.5 items-center">
                                    <label htmlFor="post" className="flex flex-row gap-1 object-cover">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                        </svg>
                                        Image
                                    </label>
                                    <input type="file" id="post" accept="image/*" className="w-0 object-cover opacity-0" onChange={e => {setSelectedImage(e.target.files[0])}}/>
                                </div>
                                <button className="px-4 py-2 text-xs rounded-full bg-sky-400 hover:bg-sky-500" onClick={handlePostSubmit} disabled={loading}>
                                    POST
                                </button>
                            </div>
                        </div>
                    </div>
                    <Feed />
                </div>

                <div className="sr:flex hidden flex-col gap-2 bg-slate-100 dark:bg-slate-800 max-w-[240px] w-full p-4 rounded-lg max-h-[540px] h-min "> 
                    <div className="flex flex-col gap-4 overflow-auto">
                        <div className="text-md text-slate-900 dark:text-slate-100 border-b pt-2 font-light border-slate-900 dark:border-slate-200">Recommendations</div>

                        <div className=" overflow-y-scroll scrollbar-hide">
                        {
                            userRecommendation?.map((user, index) => {
                                return (<UserLayout 
                                            key={index}
                                            userData={user}
                                />);
                            })
                        }
                        </div>
                        <div className="text-md text-slate-900 dark:text-slate-100 border-b font-light border-slate-900 dark:border-slate-200">Following</div>

                        <div className=" overflow-y-scroll scrollbar-hide">
                        {
                            followingUsers?.map((user, index) => {
                                return (<UserLayout 
                                            key={index}
                                            userData={user}
                                />);
                            })
                            
                        }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};