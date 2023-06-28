import React from "react";
import classes from "./logIn.module.css";
import { useRef, useState } from "react";
import { Environment } from "../../environment/environement";

const LogIn = (props) => {
  const [err, setErr] = useState("");
  const user = useRef();
  const pass = useRef();

  const subHandle = () => {
    if (!user.current.value) {
      setErr("Vui lòng điền username");
    } else if (!pass.current.value) {
      setErr("Vui lòng điền password");
    } else {
      fetch(`${Environment.baseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          getUser: user.current.value,
          getPass: pass.current.value,
        }),
      })
        .then((res) => {
          //console.log("BE da nhan dc login", res);
          return res.json();
        })
        .then((data) => {
          if (data.isLogIn) {
            // nếu đăng nhập đúng
            //console.log(data);
            props.getInf(data);
            window.location.replace("http://localhost:3000");
          } else {
            setErr(data.message);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className={classes.frame}>
      <h1>Login</h1>

      <input type="text" name="userSign" placeholder="User Name" ref={user} />
      <input
        type="password"
        name="passSign"
        placeholder="Password"
        ref={pass}
      />
      <button onClick={subHandle}>Login</button>
      <p>{err}</p>
      <a href="http://localhost:3000/signin" target="_self">
        Sign In ?
      </a>
    </div>
  );
};

export default LogIn;
