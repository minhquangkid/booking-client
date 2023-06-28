import "./list.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

import { useLocation } from "react-router-dom";
import { useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import { Environment } from "../../environment/environement";

const List = () => {
  const location = useLocation(); // kết hợp với useNavigate() bên trang home để có thể lấy thông tin phần Search bên header và điền vào trang này
  const [destination, setDestination] = useState(location.state.destination);
  const [date, setDate] = useState(location.state.date);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(location.state.options);
  const [list, setList] = useState([]);

  const submitHandle = () => {
    fetch(`${Environment.baseUrl}/list/postHotel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        destination,
        date,
        options,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setList(data.array);
        console.log(data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      {/* <Navbar /> */}
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label>Destination</label>
              <input
                placeholder={destination}
                type="text"
                onChange={(e) => {
                  setDestination(e.target.value);
                }}
              />
            </div>
            <div className="lsItem">
              <label>Check-in Date</label>
              <span onClick={() => setOpenDate(!openDate)}>{`${format(
                date[0].startDate,
                "MM/dd/yyyy"
              )} to ${format(date[0].endDate, "MM/dd/yyyy")}`}</span>
              {openDate && (
                <DateRange
                  onChange={(item) => setDate([item.selection])}
                  minDate={new Date()}
                  ranges={date}
                />
              )}
            </div>
            <div className="lsItem">
              <label>Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Min price <small>per night</small>
                  </span>
                  <input type="number" className="lsOptionInput" />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Max price <small>per night</small>
                  </span>
                  <input type="number" className="lsOptionInput" />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.adult}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input
                    type="number"
                    min={0}
                    className="lsOptionInput"
                    placeholder={options.children}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Room</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    placeholder={options.room}
                  />
                </div>
              </div>
            </div>
            <button onClick={submitHandle}>Search</button>
          </div>
          <div className="listResult">
            {list.map((item) => {
              return (
                <SearchItem
                  key={item._id}
                  name={item.name}
                  type={item.type}
                  description={item.desc}
                  price={item.cheapestPrice}
                  img_url={item.photos[0]}
                  distance={item.distance}
                  free_cancel={item.featured}
                />
              );
            })}

            {/*  name,
  distance,
  tag,
  type,
  description,
  free_cancel,
  price,
  rate,
  rate_text,
  img_url, */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default List;
