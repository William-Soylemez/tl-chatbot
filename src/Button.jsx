import { useState } from "react";

const Button = ({ children, onClick, className }) => {
  const [loading, setLoading] = useState(false);

  return (
    <button
      className={className + " " + (loading ? "opacity-50" : "")}
      onClick={async () => {
        setLoading(true);
        await onClick();
        setLoading(false);
      }}
      disabled={loading}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

export default Button;