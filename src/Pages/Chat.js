import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "../App.css";

const socket = io.connect("http://localhost:8080");

export default function Chat() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [strikeThrough, setStrikeThrough] = useState(false);
  const messageContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      setBold(data.properties.bold);
      setItalic(data.properties.italic);
      setStrikeThrough(data.properties.strikeThrough);
    });
    //eslint-disable-next-line
  }, [messages]);

  const joinRoom = () => {
    if (handleValidation()) {
      setIsLoggedIn(true);
      socket.emit("join", room);
    }
  };

  const handleValidation = () => {
    if (room === "" || name === "") {
      alert("Fields cannot be empty");
      return false;
    } else {
      return true;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const sendMessage = () => {
    console.log("I am called");
    const messageData = {
      name,
      message: input,
      room,
      properties:{
        bold:bold,
        italic:italic,
        strikeThrough:strikeThrough,
      }
    };
    socket.emit("message", messageData);
    setInput("");
  };
  return (
    <div>
      {isLoggedIn === false ? (
        <>
          <div className="form-group col-md-10 offset-md-1 mt-5">
            <input
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              id="name"
              className="name-input form-control bg-dark text-white"
            />
          </div>
          <div className="form-group col-md-10 offset-md-1 mt-1">
            <input
              placeholder="Enter Room Id"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              type="text"
              id="room"
              className="name-input form-control bg-dark text-white"
            />
          </div>
          <div className="form-group col-md-10 offset-md-1 mt-1">
            <button
              onClick={joinRoom}
              className="btn btn-success btn-block text-white"
            >
              <h3>Join room</h3>
            </button>
          </div>
        </>
      ) : (
        <>
          <div id="logout-div">
            <div className="row" id="logout">
              <button
                onClick={logout}
                className="btn btn-danger text-white btn-lg offset-md-6 mt-3 mb-3"
              >
                logout
              </button>
            </div>
          </div>

          <div id="chats">
            <div className="col-md-8 offset-md-1">
              {messages.map((item, i) => (
                <div className="mt-3" key={i}>
                  <strong>{item.name}</strong> : &nbsp; <br />
                  <em
                    style={{
                      fontWeight: bold ? "bold" : "normal",
                      fontStyle: italic ? "italic" : "normal",
                      textDecoration: strikeThrough ? "line-through" : "none",
                    }}
                  >
                    {item.message}
                  </em>
                </div>
              ))}
              <div ref={messageContainerRef}></div>
            </div>
          </div>
          <div className="chat-content">
            <div className="text-format d-flex">
              <i
                onClick={() => setBold(!bold)}
                className="icon fa-solid fa-bold"
              ></i>
              <i
                onClick={() => setItalic(!italic)}
                className="icon fa-solid fa-italic"
              ></i>
              <i
                onClick={() => setStrikeThrough(!strikeThrough)}
                className="icon fa-solid fa-strikethrough"
              ></i>
              <i
                className="icon fa-solid fa-link"
              ></i>
              <i className="icon fa-solid fa-list-ul"></i>
              <i className="icon fa-solid fa-list-ol"></i>
              <i
                className="icon fa-solid fa-quote-left"
              ></i>
              <i className="icon fa-solid fa-code"></i>
            </div>
            <div className="form-group">
              <input
                id="chat-input-box"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{
                  fontWeight: bold ? "bold" : "normal",
                  fontStyle: italic ? "italic" : "normal",
                  textDecoration: strikeThrough ? "line-through" : "none",
                }}
                type="text"
                placeholder="Chat goes here.."
                className="form-control name-input text-white"
              />
            </div>
            <div className="add-ins mb-2 d-flex">
              <i className="icon fa-solid fa-plus"></i>
              <i className="icon fa-regular fa-face-smile"></i>
              <h4 className="text-white ml-3">@</h4>
            </div>
            <button
              onClick={sendMessage}
              className="btn-success col-1 offset-11 mb-2"
            >
              <i className="fa-solid fa-share"></i>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
