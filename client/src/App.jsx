import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import SignUp from "./pages/Signup.jsx";
import Login from "./pages/Signin.jsx";
// import Toast, { Toaster } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";

function App() {
  const { authUser } = useAuthContext();
  return (
    <div className="p-4 h-screen flex items-center justify-center">
      {/* <Home /> */}
      {/* <Route path="/" element={<Home />} /> */}
      {/* <Route path="/login" element={<Login />} /> */}
      {/* <Route path="/signup" element={<SignUp />} /> */}
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Home />}
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <SignUp />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
