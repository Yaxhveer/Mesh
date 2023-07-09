import { createContext, useContext, useEffect } from "react";
import { useState} from "react";
import { getUserData } from "../../services/services";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currUser, setCurrUser] = useState();
  const [currUserInfo, setCurrUserInfo] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const value = { currUser, setCurrUser, error, setError, currUserInfo, setCurrUserInfo};

  useEffect(() => {
    if (sessionStorage.getItem('userID')){
      setCurrUser(parseInt(sessionStorage.getItem('userID')));
    }
    setLoading(false);
  }, [currUser])

  useEffect(() => {
    if (currUser){
      getUserData(currUser).then((data) => {
        if (data.done){
          setCurrUserInfo(data.data);
        }
      })
    }
  }, [currUser])

  return (
    <AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>
  );
}