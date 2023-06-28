import React from "react";
import classes from "./logIn.module.css";
import { useRef, useState } from "react";
import { Environment } from "../../environment/environement";

const SignIn = () => {
  const [err, setErr] = useState("");
  const user = useRef();
  const pass = useRef();

  const subHandle = () => {
    if (!user.current.value) {
      setErr("Vui lòng điền username");
    } else if (!pass.current.value) {
      setErr("Vui lòng điền password");
    } else {
      fetch(`${Environment.baseUrl}/sign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          getUser: user.current.value,
          getPass: pass.current.value,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data); // xuất ra respond của BE (có thể là kết quả hoặc thông báo lỗi 400)
          if (data.redirect) {
            // nếu thành công sẽ chuyển hướng trang
            window.location.replace(data.message);
          } else {
            setErr(data.message);
          }
        });
    }
  };

  return (
    <div className={classes.frame}>
      <h1>Sign Up</h1>
      <input type="text" name="userSign" placeholder="User Name" ref={user} />
      <input
        type="password"
        name="passSign"
        placeholder="Password"
        ref={pass}
      />
      <button onClick={subHandle}>Create Account</button>
      <p>{err}</p>
    </div>
  );
};

export default SignIn;
