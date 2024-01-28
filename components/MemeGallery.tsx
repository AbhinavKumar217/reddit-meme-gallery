import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography } from "@mui/material";
import Modal from "react-modal";
import { Close as CloseIcon } from "@mui/icons-material";

// const getRandomImageUrl = () => {
//   const randomNumber = Math.floor(Math.random() * 1000);
//   return `https://picsum.photos/1920/1080?random=${randomNumber}`;
// };

const galleryStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: "20px",
  background: "linear-gradient(45deg, #ff6b6b, #3b5998)",
  padding: "20px",
  borderRadius: "15px",
};

const additionalContentStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  marginTop: "20px",
  padding: "20px",
  position: "relative",
  borderRadius: "15px",
  background: "linear-gradient(45deg, #ff6b6b, #3b5998)",
  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
};

const modalStyle: ReactModal.Styles = {
  content: {
    maxWidth: "80%",
    maxHeight: "100%",
    margin: "auto",
    border: "none",
    borderRadius: "8px",
    overflow: "auto",
    position: "fixed"
  },
};

const closeButtonStyle: React.CSSProperties = {
  zIndex: 1,
  cursor: "pointer",
  display: "none",
};

interface Meme {
  title: string;
  thumbnail: string;
  fullImage: string;
}

const MemeGallery: React.FC = () => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [after, setAfter] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    fetchMemes();
  }, []);

  const fetchMemes = async () => {
    try {
      const response = await axios.get(
        `https://www.reddit.com/r/memes.json${after ? `?after=${after}` : ""}`
      );
      const newMemes = response.data.data.children.map(
        (child: {
          data: { title: string; thumbnail: string; url: string };
        }) => ({
          title: child.data.title,
          thumbnail: child.data.thumbnail,
          fullImage: child.data.url,
        })
      );

      setMemes((prevMemes) => [...prevMemes, ...newMemes]);
      setAfter(response.data.data.after);
    } catch (error) {
      console.error("Error fetching memes:", error);
    }
  };

  const openGallery = (index: number) => {
    setCurrentImage(memes[index].fullImage);
    setModalIsOpen(true);
  };

  const closeGallery = () => {
    setModalIsOpen(false);
  };

  const handleModalClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      closeGallery();
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      fetchMemes();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Container>
      <div style={{ background: 'radial-gradient(circle at 18.7% 37.8%, rgb(250, 250, 250) 0%, rgb(225, 234, 238) 90%)', padding: '40px', borderRadius: '24px' }}>
        <div style={additionalContentStyle}>
          <Typography variant="h1" component="div" gutterBottom>
            Reddit Meme Gallery
          </Typography>
          <div>
            <Typography variant="body2">- By Abhinav Kumar</Typography>
          </div>
        </div>
        <br />
        <br />
        <div
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            cursor: "pointer",
          }}
          onClick={closeGallery}
        >
          {modalIsOpen && <CloseIcon fontSize="large" />}
        </div>
        <div style={galleryStyle}>
          {memes.map((meme, index) => (
            <div
              key={index}
              onClick={() => openGallery(index)}
              style={{ cursor: "pointer", position: "relative" }}
            >
              <img
                src={meme.thumbnail}
                alt={meme.title}
                loading="lazy"
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  height: Math.floor(Math.random() * 100 + 150) + "px",
                }}
              />
            </div>
          ))}
        </div>
        
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeGallery}
          style={modalStyle}
          overlayClassName="modal-overlay"
        >
          <div
            onClick={handleModalClick}
            style={{ width: "100%", height: "100%" }}
          >
            <img
              src={currentImage}
              alt="Full Resolution"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "none",
                borderRadius: "8px",
              }}
            />
          </div>
        </Modal>
      </div>
    </Container>
  );
};

export default MemeGallery;
