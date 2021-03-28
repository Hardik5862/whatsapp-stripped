import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import db, { auth } from "../firebase";

import Avatar from "@material-ui/core/Avatar";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import SidebarChat from "./SidebarChat";
import Button from "@material-ui/core/Button";
import "./Sidebar.css";

const Sidebar = () => {
  const history = useHistory();
  const [user] = useAuthState(auth);
  const [sterm, setSterm] = useState("");
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection("rooms").onSnapshot((snapshot) => {
      setRooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const filteredRooms = rooms.filter((room) =>
    room.data.name.toLowerCase().includes(sterm.toLowerCase())
  );

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={user?.photoURL} />
        <div className="sidebar__headerRight">
          <Button
            onClick={() => {
              auth.signOut();
              history.push("/");
            }}
          >
            <ExitToAppIcon style={{ margin: "0 5px" }} /> Sign Out
          </Button>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlinedIcon />
          <input
            placeholder="Search group"
            type="text"
            value={sterm}
            onChange={(e) => setSterm(e.target.value)}
          />
        </div>
      </div>
      <div className="sidebar__chats">
        <SidebarChat addNewChat />
        {filteredRooms.map((room) => (
          <SidebarChat key={room.id} id={room.id} name={room.data.name} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
