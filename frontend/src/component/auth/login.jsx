import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState} from "react";
import { login } from "../../services/services";
import { useAuth } from "../context/authContext";

export default function Login() {
  const [ loading, setLoading ] = useState(false);
  const [ email, setEmail ] = useState();
  const [ password, setPassword ] = useState();
  const { setCurrUser, setError } = useAuth();

  const navigate = useNavigate();
  
  useEffect(()=>{
    setError("");
  }, []);

  async function handlFormSubmit(e){
    e.preventDefault();
    try {
      setLoading(true);

      const data = await login(email, password);
      if (data.done) {
        setCurrUser(data.user_id)
        navigate("/");
      } else {
        setError(data.msg)
      }
      
    } catch (e) {
      console.log(e);
      setError("Login Failed.");
    }

    setLoading(false);
  }


  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div>
          <h2 className="mt-4 text-3xl text-center font-light dark:text-gray-200">
            Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handlFormSubmit}>
          <div className="rounded-md shadow-sm">
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none w-full px-3 py-2 rounded-t-md placeholder-gray-500 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none w-full px-3 py-2 rounded-b-md placeholder-gray-500 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-700 hover:bg-sky-800 dark:bg-sky-500 dark:hover:bg-sky-600"
            >
              Login
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/register"
                className="text-blue-700 hover:underline dark:text-blue-400"
              >
                Don't have an account? Register
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}