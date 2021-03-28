import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import db from "../firebase";
import Avatar from "@material-ui/core/Avatar";
import "./SidebarChat.css";

const SidebarChat = ({ addNewChat, name, id }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    db.collection("rooms")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setMessages(snapshot.docs.map((doc) => doc.data()))
      );
  }, [id]);

  const createChat = () => {
    const roomName = prompt("Please enter name for new group: ");

    if (roomName) {
      db.collection("rooms").add({
        name: roomName,
      });
    }
  };

  return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar
          src={`https://avatars.dicebear.com/api/jdenticon/${id}.svg?background=%23ffffff`}
        />
        <div className="sidebarChat__info">
          <h2>{name}</h2>
          <p>{messages.length > 0 && messages[0].message}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="sidebarChat">
      <h2>Add New Group</h2>
    </div>
  );
};

export default SidebarChat;
