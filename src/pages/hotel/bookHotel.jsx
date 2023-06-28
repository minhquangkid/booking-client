import React, { Fragment } from "react";
import classes from "./bookHotel.module.css";
import { DateRange } from "react-date-range";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { Environment } from "../../environment/environement";

const BookHotel = (props) => {
  let { id } = useParams(); // vì trong App.js phần router dùng /:id

  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [list, setList] = useState([]);

  const [inf, setInf] = useState({
    username: props.nameUser,
    idHotel: id,
    fullName: "", // các thông tin này nếu user đang đăng nhập thì điền vào nếu có, ko thì tạo lưu lại ngay lúc này
    email: "",
    phoneNumber: "",
    idCard: "",
    dateStart: "",
    dateEnd: "",
    roomArray: [], //bên trong là tập hợp các object với 2 key là id của loại room và các number room đã chọn
    payMethod: "",
    price: 0,
  });

  const [total, setTotal] = useState(0);

  const result = useRef([]); // phải dùng useRef vì nếu ko dùng thì mỗi khi state render lại trang sẽ bị mất giá trị lưu trước đó

  useEffect(() => {
    // console.log(id);
    // sau này khi lọc ra được thời gian book thì cập nhật vô
    fetch(`${Environment.baseUrl}/getRoom`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setList(data.listRoom);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    // tính tổng tiền

    let tong = 0;
    const soNgay = new Date(inf.dateEnd) - new Date(inf.dateStart);
    const getDay = Math.ceil(soNgay / (1000 * 60 * 60 * 24)); // đổi từ mili giây sang ngày
    // console.log(getDay);
    inf.roomArray.forEach((e) => {
      const type = list.find((item) => {
        return item._id === e.roomType;
      });
      tong = tong + type.price * e.listNumber.length;
    });

    setTotal(tong * getDay);
    setInf((prev) => {
      return {
        ...prev,
        price: tong * getDay,
      };
    });
  }, [date, clickHandle]);

  const handleSelect = (ranges) => {
    const timeTable = ranges.selection;
    setDate([timeTable]);
    // console.log(timeTable); // lấy ra ngày chọn
    setInf((prev) => {
      return {
        ...prev,
        dateStart: timeTable.startDate, // giá trị time đang là object , nếu muốn chuyển về string  thì dùng .toString() phía sau
        dateEnd: timeTable.endDate,
      };
    });
  };

  const handleChange = (e) => {
    // console.log("id: ", e.target.id);
    // console.log("value: ", e.target.value);
    // console.log("date start", inf.dateStart);
    // console.log("date end", inf.dateEnd);
    const tam = inf;
    tam[e.target.id] = e.target.value; // dấu [] là để lấy key của object dựa theo biến
    setInf(tam);
  };

  const submitHandle = () => {
    fetch(`${Environment.baseUrl}/postBook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inf }),
    })
      .then(() => {
        alert("Succeed !");
      })
      .catch((err) => console.log(err));
  };

  function clickHandle(e) {
    console.log(e.target.id); // gán id của loại room vô trong thuộc tính id của input
    console.log(e.target.title); // gán tên phòng vô trong thuộc tính title của input
    console.log(e.target.checked); // kiểm tra đã checked hay chưa, trả về true, false

    /////// result ban đầu sẽ rỗng nhưng sau khi chèn vào sẽ có cấu trúc như vầy
    // const result = [
    //   {
    //     listNumber: [],
    //     roomType: '',
    //   },
    // ] //bên trong là object với id của loại room và các number room đã chọn
    const kt = result.current.findIndex((t) => {
      // tìm vị trí id đã có sẵn (nếu có)
      return t.roomType === e.target.id;
    });
    // console.log(kt);
    if (kt === -1 && e.target.checked) {
      // nếu chưa có id hotel và tick vào checkbox
      result.current.push({
        listNumber: [e.target.title],
        roomType: e.target.id,
      });
    } else if (kt !== -1 && e.target.checked) {
      // đã có id hotel và tick vào checkbox
      result.current[kt].listNumber.push(e.target.title);
    } else if (kt !== -1 && e.target.checked === false) {
      // đã có id hotel và hủy checkbox
      const stt = result.current[kt].listNumber.findIndex((x) => {
        return x === e.target.title;
      });
      result.current[kt].listNumber.splice(stt, 1); // xóa bỏ số phòng khỏi array
      if (result.current[kt].listNumber.length === 0) {
        result.current.splice(kt, 1); // nếu ko có số phòng nào trong mảng thì xóa luôn object dữ liệu về loại phòng này
      }
    } else {
      return;
    }
    console.log(result.current);
    setInf((prev) => {
      return { ...prev, roomArray: result.current };
    });
  }

  return (
    <Fragment>
      <div className={classes.dateContainer}>
        <div className={classes.calendar}>
          <h2>Dates</h2>
          <DateRange
            editableDateInputs={true}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            ranges={date}
            className=""
            minDate={new Date()}
          />
        </div>
        <div className={classes.register}>
          <h2>Reserve Info </h2>
          <form>
            <label htmlFor="fullName">Your Full Name</label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              placeholder="Full Name"
              onChange={handleChange}
            />

            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              onChange={handleChange}
            />

            <label htmlFor="phone">Your Phone Number</label>
            <input
              type="number"
              name="phone"
              id="phoneNumber"
              placeholder="Phone Number"
              onChange={handleChange}
            />

            <label htmlFor="idCard">Your Identity Card Number</label>
            <input
              type="text"
              name="idCard"
              id="idCard"
              placeholder="Card Number"
              onChange={handleChange}
            />
          </form>
        </div>
      </div>
      <h2>Select Rooms</h2>
      <div className={classes.roomContainer}>
        {list.map((item) => {
          return (
            <div className={classes.room} key={item._id}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <p style={{ fontWeight: 700 }}>Max People : {item.maxPeople}</p>
              <p style={{ fontWeight: 700 }}>${item.price}</p>
              <div className={classes.listRoom}>
                {item.roomNumbers.map((number) => {
                  return (
                    <div key={number}>
                      <label htmlFor={number}> {number}</label>
                      <br />
                      <input
                        type="checkbox"
                        id={item._id}
                        name={number}
                        title={number}
                        onChange={clickHandle}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className={classes.dateContainer}>
        <div className={classes.calendar}>
          <h2>Total Bill : {total || 0}</h2>
          <select
            name="payment"
            className={classes.payment}
            id="payMethod"
            onChange={handleChange}
          >
            <option value="">Select Payment Method</option>
            <option value="creditCard">Credit Card</option>
            <option value="cash">Cash</option>
          </select>
        </div>
        <div className={classes.register}>
          <button onClick={submitHandle}>Reserve Now</button>
        </div>
      </div>
    </Fragment>
  );
};

export default BookHotel;
