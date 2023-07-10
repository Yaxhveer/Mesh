import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { editProfile, getUserData, logout } from "../../services/services";
import { useAuth } from "../context/authContext";

export default function EditProfile () {
    const [ edit, setEdit ] = useState(false);
    const [ userName, setUserName ] = useState();
    const [ displayName, setDisplayName ] = useState();
    const [ about, setAbout ] = useState();
    const [ avatar, setAvatar ] = useState();
    const [ avatarSelected, setAvatarSelected ] = useState();
    const [ loading, setLoading ] = useState(true);
    const { currUser, setCurrUser, setCurrUserInfo, error, setError } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setError('');
        const fetchData = async () => {
            const data = await getUserData(currUser);
            if (!data.done) setError("Task Failed");
            else {
                if (!data.data.user_id) return;
                else {
                    setUserName(data?.data.user_name);
                    setDisplayName(data?.data.display_name);
                    setAbout(data?.data.about);
                    setAvatar(data?.data.avatar);
                }
            }
        }
        fetchData();
        setLoading(false);
    }, [])

    const handleSubmit = async () => {
        setLoading(true);
        setEdit(false);
        console.log(avatar);
        try {
            const formData = new FormData();
            if (avatarSelected) formData.append("avatar", avatar);
            formData.append("about", about);
            formData.append("userName", userName);
            formData.append("displayName", displayName);
            formData.append("userID", currUser);

            const data = await editProfile(formData);
            if (!data.done) setError(data.msg);
            else {
                console.log(data.data);
                setCurrUserInfo(data.data)
                navigate('/');
            }
        } catch (e) {
            console.log(e.message);
            setError("Task Failed")
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        const data = await logout();
        if (data.done){
            setCurrUser();
            navigate('/login');
        } else {
            setError("Failed to Logout");
        }
    };

    return( !loading &&
        <div className={"flex " + ( error ? "h-[calc(100vh-121.33px)] " : "h-[calc(100vh-53.33px)]" )}>
            <div className="flex sr:flex-row flex-col w-full sr:gap-8 gap-2 srollbar-hide md:mx-24 sr:mx-16 xs:mx-8 mx-4 pt-12 pb-4 overflow-auto scrollbar-hide">
                <div className={"flex sr:flex-col sr:justify-center justify-between sr:items-center flex-row sr:max-w-[200px] max-h-72 sr:pr-10 pr-0 w-full sr:border-r border-r-0 " + (edit ? "sr:gap-4" : "sr:gap-10")}>
                    <div>
                        <div className="flex w-24 h-24 justify-center items-center dark:text-gray-950 text-gray-50 rounded-full">
                        {avatar ?
                            <img src={avatarSelected ? URL.createObjectURL(avatar) : `/api/${avatar}`} className="w-[78px] h-[78px] object-contains rounded-full"/>
                            : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="ss:w-24 ss:h-24 fill-white dark:fill-black rounded-full">
                                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                                </svg>
                        }
                        </div> 
                        <div className={"flex-row translate-x-[72px] w-min -translate-y-8 items-end text-xs dark:text-slate-800 text-slate-700 " + (edit ? "flex" : "hidden")}>
                            <label htmlFor="post" className="flex object-cover rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>

                            </label>
                            <input type="file" disabled={!edit || loading} id="post" accept="image/*" className="w-0 object-cover opacity-0" onChange={e => {setAvatar(e.target.files[0]); setAvatarSelected(true)}}/>
                        </div>
                    </div>
                    <div className="flex sr:flex-col sr:w-full w-min sr:gap-0 gap-4 rounded-lg content-start h-min text-slate-900 dark:text-slate-100">
                        <div className={"flex flex-row gap-4 sr:w-full p-2 sr:rounded-t-lg sr:rounded-b-none rounded-lg border-b border-slate-400 dark:border-slate-600 bg-slate-200 dark:bg-slate-800" + (edit ? " bg-slate-300 rounded-t-lg" : "")} onClick={() => setEdit(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                            <div className="sr:block hidden">Edit</div>
                        </div>
                        <div className="flex flex-row gap-4 sr:w-full p-2 border-b sr:rounded-none rounded-lg border-slate-400 dark:border-slate-600 bg-slate-200 dark:bg-slate-800" onClick={handleSubmit}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                            <div className="sr:block hidden">Save</div>
                        </div>
                        <div className=" flex-row gap-4 sr:w-full p-2 sr:rounded-b-lg sr:flex hidden bg-slate-200 dark:bg-slate-800" onClick={handleLogout}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                            </svg>
                            <div>Logout</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4 pt-2 px-2 w-full max-w-xl">
                    <div className="pl-1 md:text-4xl text-2xl font-semibold">
                        Account Details
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="userName" className="text-lg pl-1">Username</label>
                        <input
                            id="userName"
                            required
                            className="appearance-none w-full px-3 py-2 rounded-md placeholder-gray-500 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:z-10 sm:text-sm"
                            defaultValue={userName}
                            onChange={e => setUserName(e.target.value)}
                            disabled={!edit}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="displayName" className="text-lg pl-1">Display Name</label>
                        <input
                            id="displayName"
                            required
                            className="appearance-none w-full px-3 py-2 rounded-md placeholder-gray-500 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:z-10 sm:text-sm"
                            defaultValue={displayName}
                            onChange={e => setDisplayName(e.target.value)}
                            disabled={!edit}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="about" className="text-lg pl-1">About</label>
                        <input
                            id="about"
                            required
                            className="appearance-none w-full px-3 py-2 rounded-md placeholder-gray-500 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:z-10 sm:text-sm"
                            defaultValue={about}
                            onChange={e => setAbout(e.target.value)}
                            disabled={!edit}
                        />
                    </div>
                </div>
            </div>

        </div>
    )
}