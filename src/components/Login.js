import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import Button from "@material-ui/core/Button";
import { auth, provider } from "../firebase";

import "./Login.css";

const Login = () => {
  const handleSignIn = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div className="login">
      <div className="login__container">
        <WhatsAppIcon
          style={{ fontSize: 100, color: "#0a8d48" }}
          className="login__icon"
        />
        <div className="login__text">
          <h1>Sign in to Whatsapp Stripped</h1>
        </div>
        <Button onClick={handleSignIn}>Continue with Google</Button>
      </div>
    </div>
  );
};

export default Login;
