import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import loader from "../assets/loader.gif";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { Buffer } from "buffer";
import { setAvatarRoute } from '../utils/APIRoutes';
function SetAvatar() {
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectdAvatar] = useState(undefined);
  const api = `https://api.multiavatar.com/4645646`;
  const toastOptions = {
    position: "bottom-right",
    authClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark'
  }
  var navigate = useNavigate();



  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = await JSON.parse(localStorage.getItem("chat-app-user"));
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar]
      });

      if (data.isSet) {
        user.isAvartarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("chat-app-user", JSON.stringify(user));
        navigate("/");
      } else {
        toast.error("Error setting avatar. Please  try again", toastOptions);
      }

    }
  };

  useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate('/login');
    }
  }, [navigate])

  useEffect(() => {
    const fetchData = async () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}`
        );
        const buffer = new Buffer(image.data);
        data.push(buffer.toString("base64"));
      }

      setAvatars(data);
      setIsLoading(false);
    }
    fetchData()
  }, [api])

  return (
    <>
      {
        isLoading ? <Container>
          <img src={loader} alt="" />
        </Container> : (


          <Container>
            <div className="title-container">
              <h1>
                Pick an avatar as your profle picture
              </h1>
              <div className="avatars">
                {
                  avatars.map((avatar, index) => {
                    return (
                      <div key={index} className={`avatar ${selectedAvatar === index ? "selected" : ""}`} >
                        <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar"
                          onClick={() => setSelectdAvatar(index)}
                        />
                      </div>
                    )
                  })
                }
              </div>
              <button className='submit-btn' onClick={setProfilePicture} >Set as  Profile Picture</button>
            </div>
          </Container>
        )
      }
      <ToastContainer />
    </>
  )
}

const Container = styled.div`
    display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;

export default SetAvatar
