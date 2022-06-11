import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ChatContainer from "../components/ChatContainer";
import Contact from "../components/Contact";
import Welcome from "../components/Welcome";
import { allUsersRoute, host } from "../utils/APIRoutes";
import { io } from "socket.io-client";

function Chat() {
    const [contacts, setContacts] = useState([]);
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(undefined);

    const [currentChat, setCurrentChat] = useState(undefined);


    const socket = useRef();


    useEffect(() => {
        async function fetchData() {
            if (!localStorage.getItem("chat-app-user")) {
                navigate("/login");
            } else {
                setCurrentUser(
                    await JSON.parse(
                        localStorage.getItem("chat-app-user")
                    )
                );
            }
        }
        fetchData()
    }, [navigate]);

    useEffect(() => {
        if (currentUser) {
            socket.current = io(host);
            socket.current.emit("add-user", currentUser._id);
        }
    }, [currentUser])

    useEffect(() => {

        async function fetchData() {
            if (currentUser) {
                if (currentUser.isAvartarImageSet) {
                    const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
                    setContacts(data.data);
                } else {
                    navigate("/setAvatar");
                }
            }
        }
        fetchData();
    }, [currentUser, navigate]);

    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    };

    return (
        <Container>
            <div className="container">
                <Contact
                    contacts={contacts}
                    currentUser={currentUser}
                    changeChat={handleChatChange}
                />
                {
                    currentUser === undefined ? (
                        <Welcome currentUser={currentUser} />
                    ) : (
                        <ChatContainer
                            currentChat={currentChat}
                            currentUser={currentUser}
                            socket={socket}
                        />
                    )
                }

            </div>
        </Container>
    );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat;
