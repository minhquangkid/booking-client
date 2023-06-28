import "./featuredProperties.css";

const FeaturedProperties = (props) => {
  return (
    <div className="fp">
      {props.top.map((item, index) => {
        return (
          <div className="fpItem" key={index}>
            <img src={item.photos[0]} alt="" className="fpImg" />
            <span className="fpName">
              <a href={`/hotels/${item._id}`} target="_blank" rel="noreferrer">
                {item.name}
              </a>
            </span>
            <span className="fpCity">{item.city}</span>
            <span className="fpPrice">Starting from ${item.cheapestPrice}</span>
          </div>
        );
      })}
    </div>
  );
};

export default FeaturedProperties;
