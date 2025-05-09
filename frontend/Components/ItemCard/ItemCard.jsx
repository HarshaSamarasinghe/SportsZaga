import "./ItemCard.css";

function ItemCard({ item, url }) {
  return (
    <div className="cardWrapper">
      <div className="cardContainer">
        <i class="bx bx-heart"></i>
        <div className="itemImage">
          <img src={url + "/images/" + item.image} alt={item.name} />
        </div>
        <div className="itemDetails">
          <div className="itemNameAndPrice">
            <h3 className="itemName">{item.name}</h3>
            <h4 className="itemPrice">LKR {item.basePrice.toFixed(2)}</h4>
          </div>
          <div className="buyItem">
            <button className="buy">Buy</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemCard;
