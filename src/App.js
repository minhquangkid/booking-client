import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import LogIn from "./pages/resgister/logIn";
import SignIn from "./pages/resgister/signIn";
import Transaction from "./pages/transaction/transaction";
import { Environment } from "../../environment/environement";

function App() {
  const [log, setLog] = useState({ status: false, user: "" });

  useEffect(() => {
    // gửi request GET để tìm xem có user nào đã đăng nhập mà chưa thoát ra ko? nếu có thì login luôn cho họ
    fetch(`${Environment.baseUrl}/init`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          console.log(data);
          setLog({ status: data.isLogIn, user: data.username });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleInf = (inf) => {
    //console.log("day la app", inf);
    setLog({ status: inf.isLogIn, user: inf.message });
  };
  return (
    <BrowserRouter>
      <Navbar userName={log} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<List />} />
        <Route path="/hotels/:id" element={<Hotel userName={log.user} />} />

        <Route path="/login" element={<LogIn getInf={handleInf} />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/transaction"
          element={<Transaction userName={log.user} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
