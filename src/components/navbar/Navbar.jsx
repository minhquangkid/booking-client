import "./navbar.css";
import { useState, useEffect } from "react";
import { Environment } from "../../environment/environement";

const Navbar = (props) => {
  const [onl, setOnl] = useState({ show: false, content: "" });

  useEffect(() => {
    //console.log("day la nav", props.userName.status, props.userName.userMail);
    setOnl({ show: props.userName.status, content: props.userName.user });
  }, [props]);

  const logOut = () => {
    setOnl({ show: false, content: props.userName.user });

    fetch(`${Environment.baseUrl}/logout`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        user: props.userName.user, // gửi tên user để mongodb đăng xuất user đó
      }),
    })
      .then()
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        <span
          className="logo"
          onClick={() => {
            return window.location.replace("http://localhost:3000");
          }}
        >
          Booking Website
        </span>
        <div className="navItems">
          <label className="nameUser">{onl.show ? onl.content : ""}</label>
          {onl.show ? (
            <button
              className="navButton"
              id="trans"
              onClick={() => {
                return window.location.replace(
                  "http://localhost:3000/transaction"
                );
              }}
            >
              Transactions
            </button>
          ) : (
            <button
              className="navButton"
              id="res"
              onClick={() => {
                return window.location.replace("http://localhost:3000/signin");
              }}
            >
              Register
            </button>
          )}
          {onl.show ? (
            <button className="navButton" id="logout" onClick={logOut}>
              Logout
            </button>
          ) : (
            <button
              className="navButton"
              id="login"
              onClick={() => {
                return window.location.replace("http://localhost:3000/login");
              }}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
