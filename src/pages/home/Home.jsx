import Featured from "../../components/featured/Featured";
import FeaturedProperties from "../../components/featuredProperties/FeaturedProperties";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Navbar from "../../components/navbar/Navbar";
import PropertyList from "../../components/propertyList/PropertyList";
import "./home.css";
import { useEffect, useState } from "react";
import { Environment } from "../../environment/environement";

const Home = () => {
  const [content, setContent] = useState({
    // tạo ra các thuộc tính trước để dễ tìm kiếm
    cityType: ["Ha Noi", "Ho Chi Minh", "Da Nang"],
    hotelType: ["hotel", "apartments", "resorts", "villas", "cabins"],
    topRate: [],
  });
  useEffect(() => {
    fetch(`${Environment.baseUrl}/center`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setContent(data.message);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div>
      <Header />
      <div className="homeContainer">
        <Featured city={content.cityType} />
        <h1 className="homeTitle">Browse by property type</h1>
        <PropertyList hotel={content.hotelType} />
        <h1 className="homeTitle">Homes guests love</h1>
        <FeaturedProperties top={content.topRate} />
        <MailList />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
