import { useState } from "react";
import { useAuth } from "./AuthProvider";

const Auth = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const { login, signup } = useAuth();

  return (
    <div className="max-w-4xl mx-auto bg-green-100 border-4 border-amber-800 p-5">
      <h1>Sign in or sign up!</h1>
      <input
        type="text"
        placeholder="Username"
        className="border-2 border-amber-800 w-full p-2 my-3"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border-2 border-amber-800 w-full p-2 my-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex flex-row justify-center items-center ">
        <button
          className="bg-amber-800 text-white p-2 m-3 w-1/3 border-2 border-amber-800"
          onClick={() => login(userName, password)}
        >
          Sign in
        </button>
        <button
          className="bg-amber-800 text-white p-2 w-1/3 border-2 border-amber-800"
          onClick={() => signup(userName, password)}
        >
          Sign up
        </button>
      </div>
    </div>
  );
}

export default Auth;