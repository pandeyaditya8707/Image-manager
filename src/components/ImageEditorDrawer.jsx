import { useState } from "react";
import { Drawer, Box, Slider, Button, IconButton, Stack, Typography, Divider } from "@mui/material";
import Cropper from "react-easy-crop";
import { RotateRight, Flip } from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
import CropIcon from '@mui/icons-material/Crop';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import FlipIcon from '@mui/icons-material/Flip';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import getCroppedImg from '../utils/cropImage';

const ImageEditorDrawer = ({ open, onClose, image, onSave }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [aspect, setAspect] = useState(null); // null for freeform, 1 for square

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleFlipHorizontal = () => {
    setFlipHorizontal(!flipHorizontal);
  };

  const handleFlipVertical = () => {
    setFlipVertical(!flipVertical);
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSave = async () => {
    try {
      if (croppedAreaPixels) {
        const croppedImage = await getCroppedImg(
          image,
          croppedAreaPixels,
          rotation,
          flipHorizontal,
          flipVertical
        );
        onSave(croppedImage);
      }
    } catch (e) {
      console.error('Error cropping image:', e);
    }
  };

  const toggleCropMode = () => {
    setIsCropping(!isCropping);
    setAspect(isCropping ? null : 1); // Toggle between freeform and square
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: '100%', maxWidth: 1200 }
      }}
    >
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ 
          p: 2, 
          borderBottom: 1, 
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6">Edit Image</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Main Content */}
        <Box sx={{ 
          flex: 1, 
          position: 'relative', 
          backgroundColor: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {image && (
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              objectFit="contain"
              transform={`scale(${flipHorizontal ? -1 : 1}, ${flipVertical ? -1 : 1})`}
            />
          )}
        </Box>

        {/* Controls */}
        <Box sx={{ 
          p: 2, 
          borderTop: 1, 
          borderColor: 'divider',
          backgroundColor: '#f5f5f5'
        }}>
          <Stack spacing={2}>
            {/* Crop and Rotate Controls */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                startIcon={<CropIcon />}
                variant={isCropping ? "contained" : "outlined"}
                onClick={toggleCropMode}
              >
                Square Crop
              </Button>
              <Button
                startIcon={<RotateRightIcon />}
                onClick={handleRotate}
              >
                Rotate
              </Button>
              <Divider orientation="vertical" flexItem />
              <Button
                startIcon={<SwapHorizIcon />}
                variant={flipHorizontal ? "contained" : "outlined"}
                onClick={handleFlipHorizontal}
              >
                Flip H
              </Button>
              <Button
                startIcon={<SwapVertIcon />}
                variant={flipVertical ? "contained" : "outlined"}
                onClick={handleFlipVertical}
              >
                Flip V
              </Button>
            </Stack>

            {/* Zoom Control */}
            <Box sx={{ px: 2 }}>
              <Typography gutterBottom>Zoom</Typography>
              <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e, value) => setZoom(value)}
              />
            </Box>

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={onClose}>Cancel</Button>
              <Button 
                variant="contained" 
                onClick={handleSave}
                sx={{
                  backgroundColor: '#1a237e',
                  '&:hover': {
                    backgroundColor: '#0d47a1',
                  }
                }}
              >
                Save
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ImageEditorDrawer;
