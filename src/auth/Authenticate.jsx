import { useEffect, useState } from "react";

const Authenticate = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  useEffect(() => {
    document.title = "Login|Signup";
  }, []);

  return <div>Authenticate Page</div>;
};

export default Authenticate;
