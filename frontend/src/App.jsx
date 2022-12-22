import "./App.css";
import { useState, useRef, useEffect } from "react";
import {  Stack, Typography } from "@mui/material";
import Peer from "simple-peer";
import io from "socket.io-client";
import VideoContainer from "./components/VideoContainer";
import CallingPanel from "./components/CallingPanel";

const socket = io.connect("http://localhost:5000");

function App() {
  const [me, setMe] = useState("");
  const [receivingCall, setReceivingCall] = useState(false);
  const [stream, setStream] = useState();
  const [caller, setCaller] = useState("");
  const [callerName, setCallerName] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  const reset = () => {
    setReceivingCall(false);
    setCallEnded(true);
    setCallAccepted(false);
    setIdToCall("");
    setCallerSignal(null);
    setCaller("");
    setCallerName("");
    socket.off("callAccepted");
    userVideo.current.srcObject = null;
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
      });

    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerName(data.name);
      setCallerSignal(data.signal);
    });

    socket.on("callEnded", () => {
      console.log("ended");
      reset();
    });
  }, []);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name,
      });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    socket.on("callAccepted", (data) => {
      setCallAccepted(true);
      setCallEnded(false);
      setCallerName(data.name);
      peer.signal(data.signal);
    });

    peer.on("close", () => {
      console.log("Closed");
      socket.off("callAccepted");
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    setCallEnded(false);
    setReceivingCall(false);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", {
        signal: data,
        to: caller,
        name: name,
      });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    reset();
    connectionRef.current.destroy();
    socket.emit("leaveCall");
  };

  const nameInputChangeHandler = (e) => {
    setName(e.target.value);
  };

  const idToCallChangeHandler = (e) => {
    setIdToCall(e.target.value);
  };

  return (
    <div className="App">
      <Typography variant="h3" color="white" fontWeight="bold">
        VIDEO CHAT
      </Typography>
      <Stack direction="row" spacing={4} justifyContent="center">
        <VideoContainer ref={myVideo} muted={true} name={name} />
        <VideoContainer ref={userVideo} muted={false} name={callAccepted ? callerName: ""} />
      </Stack>
      <CallingPanel
        me={me}
        name={name}
        idToCall={idToCall}
        onNameInputChange={nameInputChangeHandler}
        onIdToCallInputChange={idToCallChangeHandler}
        showAnswer={receivingCall && !callAccepted}
        showEndCall={callAccepted && !callEnded}
        onCall={() => callUser(idToCall)}
        onAnswer={answerCall}
        onEndCall={leaveCall}
        callerName={callerName}
      />
    </div>
  );
}

export default App;
