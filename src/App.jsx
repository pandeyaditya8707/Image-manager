import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Container } from "@mui/material";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import GalleryPage from "./pages/GalleryPage";

function App() {
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const handleUpload = (data) => {
    setImages((prev) => [{
      image: data.image,
      metadata: {
        assetName: data.assetName,
        description: data.description,
        tags: data.tags
      }
    }, ...prev]);
    navigate('/gallery');
  };

  const handleUpdateImage = (oldImage, newImage) => {
    setImages(prev => prev.map(img => 
      img === oldImage ? { ...img, image: newImage } : img
    ));
  };

  return (
    <Container>
      <Routes>
        <Route path="/" element={<HomePage onAddClick={() => navigate('/upload')} />} />
        <Route 
          path="/upload" 
          element={<UploadPage onUpload={handleUpload} onClose={() => navigate('/')} />} 
        />
        <Route 
          path="/gallery" 
          element={
            <GalleryPage 
              images={images}
              onAddMore={() => navigate('/upload')}
              onUpdateImage={handleUpdateImage}
            />
          } 
        />
      </Routes>
    </Container>
  );
}

export default App;
