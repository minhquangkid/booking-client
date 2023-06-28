import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BookHotel from "./bookHotel";
import { Environment } from "../../environment/environement";

const Hotel = ({ userName }) => {
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [getDetail, setGetDetail] = useState({ photos: [] });
  const [show, setShow] = useState(false);

  let { id } = useParams(); // vì trong App.js phần router dùng /:id
  // console.log(id);

  useEffect(() => {
    fetch(`${Environment.baseUrl}/detail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }), // thay vì ghi {id : id} thì ghi tắt {id}
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setGetDetail(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? 5 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === 5 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
  };

  const trigger = () => {
    setShow(!show);
  };

  return (
    <div>
      <Header type="list" />
      <div className="hotelContainer">
        {open && (
          <div className="slider">
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="close"
              onClick={() => setOpen(false)}
            />
            <FontAwesomeIcon
              icon={faCircleArrowLeft}
              className="arrow"
              onClick={() => handleMove("l")}
            />
            <div className="sliderWrapper">
              <img
                src={getDetail.photos[slideNumber]}
                alt=""
                className="sliderImg"
              />
            </div>
            <FontAwesomeIcon
              icon={faCircleArrowRight}
              className="arrow"
              onClick={() => handleMove("r")}
            />
          </div>
        )}
        <div className="hotelWrapper">
          <button className="bookNow">Reserve or Book Now!</button>
          <h1 className="hotelTitle">{getDetail.title}</h1>
          <div className="hotelAddress">
            <FontAwesomeIcon icon={faLocationDot} />
            <span>{getDetail.address}</span>
          </div>
          <span className="hotelDistance">
            Excellent location – {getDetail.distance}m from center
          </span>
          <span className="hotelPriceHighlight">
            Book a stay over ${getDetail.cheapestPrice} at this property and get
            a free airport taxi
          </span>
          <div className="hotelImages">
            {getDetail.photos.map((photo, i) => (
              <div className="hotelImgWrapper" key={i}>
                <img
                  onClick={() => handleOpen(i)}
                  src={photo}
                  alt=""
                  className="hotelImg"
                />
              </div>
            ))}
          </div>
          <div className="hotelDetails">
            <div className="hotelDetailsTexts">
              <h1 className="hotelTitle">Stay in the heart of City</h1>
              <p className="hotelDesc">{getDetail.desc}</p>
            </div>
            <div className="hotelDetailsPrice">
              <h1>Perfect for a 9-night stay!</h1>
              <span>
                Located in the real heart of Krakow, this property has an
                excellent location score of 9.8!
              </span>
              <h2>
                <b>${getDetail.cheapestPrice}</b> (1 night)
              </h2>
              <button onClick={trigger}>Reserve or Book Now!</button>
            </div>
          </div>
          {show && <BookHotel nameUser={userName} />}
        </div>
        <MailList />
        <Footer />
      </div>
    </div>
  );
};

export default Hotel;
