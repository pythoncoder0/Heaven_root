import { Link, useLocation } from "react-router-dom";
import "./card.scss";
import apiRequest from "../../lib/apiRequest"; // adjust path if needed

function Card({ item, onDelete }) {
  const location = useLocation();
  const isProfilePage = location.pathname === "/profile";

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await apiRequest.delete(`/posts/${item.id}`);
        if (onDelete) onDelete(item.id); // Notify parent to remove from UI
      } catch (err) {
        alert("Failed to delete post.");
      }
    }
  };

  return (
    <div className="card">
      <Link to={`/${item.id}`} className="imageContainer">
        <img src={item.images[0]} alt="Post" />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="Location pin" />
          <span>{item.address}</span>
        </p>
        <p className="price">₹ {item.price}</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="Bed icon" />
              <span>{item.bedroom} bedroom</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="Bath icon" />
              <span>{item.bathroom} bathroom</span>
            </div>
          </div>
          <div className="icons">
            <div className="icon">
              <img src="/save.png" alt="Save icon" />
            </div>
            <div className="icon">
              <Link to={`/chat/${item.userId}`}>
                <img src="/chat.png" alt="Chat icon" style={{ cursor: "pointer" }} title="Chat" />
              </Link>
            </div>
          </div>
        </div>
        {isProfilePage && (
          <button onClick={handleDelete} className="deleteBtn">
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default Card;
