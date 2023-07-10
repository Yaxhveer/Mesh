import ThemeToggler from "../utils/themeToggler";
import { useAuth } from "../context/authContext";
import { logout } from "../../services/services";
import { Link, useNavigate } from "react-router-dom";
  
export default function Header () {

    const { currUser, currUserInfo, setCurrUser, setError } = useAuth();

    const navigate = useNavigate();
    const handleLogout = async () => {
        const data = await logout();
        if (data.done){
            setCurrUser();
            navigate('/login');
        } else {
            setError("Failed to Logout");
        }
    };
    
    return (
        <div className="flex flex-wrap items-center justify-between px-2 sm:px-4 py-1 border-gray-200 dark:border-gray-800 text-zinc-900 rounded-b border dark:text-white z-20 sticky top-0 ">
            <Link to="/">
                <div className="text-gray-700 dark:text-gray-300 hover:bg-cyan-200 dark:hover:bg-gray-700 focus:outline-none rounded-full text-sm p-2.5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                </div>
            </Link>
            <div className="flex" >
                { currUser && <div onClick={handleLogout} className="text-gray-700 dark:text-gray-300 hover:bg-cyan-300 dark:hover:bg-slate-800 focus:outline-none rounded-full text-sm p-2.5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                </div> }

                <button className="text-gray-700 dark:text-gray-300 hover:bg-cyan-300 dark:hover:bg-gray-800 focus:outline-none rounded-full text-sm p-2.5" onClick={() => navigate(`/profile/${currUser}`)}>
                    { currUser && (currUserInfo?.avatar ?  
                        <img src= {`/api/${currUserInfo.avatar}`} className="w-6 h-6 object-contains rounded-full"/>
                    : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>)
                    }
                </button>
                <ThemeToggler />
            </div>
        </div>
    )
}