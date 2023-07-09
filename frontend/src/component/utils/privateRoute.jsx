import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function PrivateRoute ({children}) {
    const { currUser, currUserInfo } = useAuth();

    if (currUser) {
        return children
    }
    return <Navigate to = "/login" />;

} 