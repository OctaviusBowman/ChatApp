import React from "react";
import io from "socket.io-client";

export const CTX = React.createContext();

// What to be expected from reducer action payload
/*
    --- Single Message ---
    msg{
        from: 'user'
        msg: 'hi'
        topic: 'general'
    }

    --- Entire State ---
    state {
        topic1: [
            {msg}, {msg}, {msg}
        ]
        topic2: [
            {msg}, {msg}, {msg}
        ]
    }
*/

const initState = {
  General: [
    { from: "Tay", msg: "Sup" },
    { from: "Nay", msg: "Hey" },
    { from: "Jay", msg: "Hello" }
  ],
  Greetings: [
    { from: "John", msg: "Hi" },
    { from: "Jack", msg: "Hi" },
    { from: "Sue", msg: "Hi" }
  ]
};

function reducer(state, action) {
  const { from, msg, topic } = action.payload;
  switch (action.type) {
    case "RECEIVE_MESSAGE":
      return {
        ...state,
        [topic]: [
          ...state[topic],
          {
            from: from,
            msg: msg
          }
        ]
      };
    default:
      return state;
  }
}

let socket;

function sendChatAction(value) {
  socket.emit("chat message", value);
}

export default function Store(props) {
  const [allChats, dispatch] = React.useReducer(reducer, initState);

  if (!socket) {
    socket = io(":3001");
    socket.on("chat message", function(msg) {
      dispatch({ type: "RECEIVE_MESSAGE", payload: msg });
    });
  }

  const user = "Tay" + Math.random(100).toFixed(2);

  return (
    <CTX.Provider value={{ allChats, sendChatAction, user }}>
      {props.children}
    </CTX.Provider>
  );
}
