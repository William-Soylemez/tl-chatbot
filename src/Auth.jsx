import { useState } from "react";
import { useAuth } from "./AuthProvider";
import Button from "./Button";

const Auth = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState(null);

  const { login, signup } = useAuth();

  return (
    <div className="max-w-4xl mx-auto bg-green-100 border-4 border-amber-800 p-5">
      <h1>Sign in or sign up!</h1>
      <form
        onSubmit={(e) => {
          // e.preventDefault();
          console.log("Ball");
          // login(userName, password);
        }}
      >
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
      </form>
      <div className="flex flex-row justify-center items-center ">
        <Button
          className="bg-amber-800 text-white p-2 m-3 w-1/3 border-2 border-amber-800"
          onClick={() => {
            setError(null);
            login(userName, password)
              .catch((error) => setError(error.message));
          }}
        >
          Sign in
        </Button>
        <Button
          className="bg-amber-800 text-white p-2 w-1/3 border-2 border-amber-800"
          onClick={() => {
            setError(null);
            signup(userName, password)
              .catch((error) => setError(error.message));
          }}
        >
          Sign up
        </Button>
      </div>
      {error && <div className="text-red-700">{error}</div>}
    </div>
  );
}

export default Auth;