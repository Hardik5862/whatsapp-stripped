import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase";

import db, { auth } from "../firebase";

import Avatar from "@material-ui/core/Avatar";
import "./Chat.css";

const Chat = () => {
  const dummy = useRef();
  const { roomId } = useParams();
  const [user] = useAuthState(auth);
  const [roomName, setRoomName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let unsubscribeRooms, unsubscribeMessages;
    if (roomId) {
      unsubscribeRooms = db
        .collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => {
          setRoomName(snapshot.data().name);
        });

      unsubscribeMessages = db
        .collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setMessages(snapshot.docs.map((doc) => doc.data()));
          dummy.current.scrollIntoView({ behaviour: "smooth" });
        });
    }
    return () => {
      unsubscribeMessages();
      unsubscribeRooms();
    };
  }, [roomId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.length > 0) {
      console.log(message);
      db.collection("rooms").doc(roomId).collection("messages").add({
        userId: user.uid,
        name: user.displayName,
        message: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setMessage("");
    }
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar
          src={`https://avatars.dicebear.com/api/jdenticon/${roomId}.svg?background=%23ffffff`}
        />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p>
            {messages.length > 0 &&
              new Date(
                messages[messages.length - 1]?.timestamp?.toDate()
              ).toUTCString()}
          </p>
        </div>
      </div>
      <div className="chat__body">
        {messages &&
          messages.map((message) => (
            <p
              className={`chat__message ${
                user.uid === message.userId && "chat__reciever"
              }`}
            >
              <span className="chat__name">{message.name}</span>
              {message.message}
              <span className="chat__timestamp">
                {new Date(message.timestamp?.toDate()).toUTCString()}
              </span>
            </p>
          ))}
        <div ref={dummy}></div>
      </div>
      <div className="chat__footer">
        <form>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="type a message"
          />
          <button type="submit" onClick={sendMessage}>
            Send a message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
