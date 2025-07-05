import { useState } from "react";
import "./list.scss";
import Card from "../card/Card";

function List({ posts }) {
  const [postList, setPostList] = useState(posts);

  const handleDelete = (id) => {
    setPostList(postList.filter((item) => item.id !== id));
  };

  return (
    <div className="list">
      {postList.map((item) => (
        <Card key={item.id} item={item} onDelete={handleDelete} />
      ))}
    </div>
  );
}

export default List;


