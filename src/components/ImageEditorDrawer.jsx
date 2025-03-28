import { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Drawer, 
  IconButton, 
  Stack,
  Typography,
  Slider,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CropIcon from '@mui/icons-material/Crop';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';

const ImageEditorDrawer = ({ open, image, onClose, onSave }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [aspect, setAspect] = useState(null);

  // Reset state when drawer opens
  useEffect(() => {
    if (open) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setFlipHorizontal(false);
      setFlipVertical(false);
      setIsCropping(false);
      setAspect(null);
    }
  }, [open]);

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
    setAspect(isCropping ? null : 1);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  return (
    <Drawer
      anchor={isMobile ? "bottom" : "right"}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { 
          width: isMobile ? '100%' : isTablet ? '80%' : '1200px',
          height: isMobile ? '90vh' : '100vh'
        }
      }}
    >
      <Box sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column'
      }}>
        {/* Header */}
        <Box sx={{ 
          p: isMobile ? 1 : 2, 
          borderBottom: 1, 
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant={isMobile ? "subtitle1" : "h6"}>Edit Image</Typography>
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
          justifyContent: 'center',
          minHeight: isMobile ? '50vh' : '0'
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
          p: isMobile ? 1 : 2, 
          borderTop: 1, 
          borderColor: 'divider',
          backgroundColor: '#f5f5f5'
        }}>
          <Stack spacing={isMobile ? 1 : 2}>
            {/* Crop and Rotate Controls */}
            <Stack 
              direction={isMobile ? "column" : "row"} 
              spacing={1} 
              alignItems={isMobile ? "stretch" : "center"}
            >
              <Button
                startIcon={<CropIcon />}
                variant={isCropping ? "contained" : "outlined"}
                onClick={toggleCropMode}
                fullWidth={isMobile}
                size={isMobile ? "small" : "medium"}
              >
                Square Crop
              </Button>
              <Button
                startIcon={<RotateRightIcon />}
                onClick={handleRotate}
                fullWidth={isMobile}
                size={isMobile ? "small" : "medium"}
              >
                Rotate
              </Button>
              {!isMobile && <Divider orientation="vertical" flexItem />}
              <Button
                startIcon={<SwapHorizIcon />}
                variant={flipHorizontal ? "contained" : "outlined"}
                onClick={handleFlipHorizontal}
                fullWidth={isMobile}
                size={isMobile ? "small" : "medium"}
              >
                Flip H
              </Button>
              <Button
                startIcon={<SwapVertIcon />}
                variant={flipVertical ? "contained" : "outlined"}
                onClick={handleFlipVertical}
                fullWidth={isMobile}
                size={isMobile ? "small" : "medium"}
              >
                Flip V
              </Button>
            </Stack>

            {/* Zoom Control */}
            <Box sx={{ px: isMobile ? 1 : 2 }}>
              <Typography gutterBottom variant={isMobile ? "body2" : "body1"}>
                Zoom
              </Typography>
              <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e, value) => setZoom(value)}
                size={isMobile ? "small" : "medium"}
              />
            </Box>

            {/* Action Buttons */}
            <Stack 
              direction="row" 
              spacing={2} 
              justifyContent="flex-end"
              sx={{ mt: isMobile ? 1 : 2 }}
            >
              <Button 
                onClick={onClose}
                size={isMobile ? "small" : "medium"}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={handleSave}
                size={isMobile ? "small" : "medium"}
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
