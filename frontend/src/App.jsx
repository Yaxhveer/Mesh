import Login from "./component/auth/login"
import Register from "./component/auth/register"
import HomeLayout from "./component/home/homeLayout"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import ErrorMessage from "./component/utils/errorMessage"
import { AuthProvider } from "./component/context/authContext"
import Header from "./component/home/header"
import PrivateRoute from "./component/utils/privateRoute"
import ProfileLayout from "./component/profile/profileLayout"
import EditProfile from "./component/profile/editProfile"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <ErrorMessage />
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/editProfile" element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute> 
          } />
          <Route exact path="/profile/:userID" element={
            <PrivateRoute>
              <ProfileLayout />
            </PrivateRoute> 
          } />
          <Route exact path="/" element={
            <PrivateRoute>
              <HomeLayout />
            </PrivateRoute> 
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
