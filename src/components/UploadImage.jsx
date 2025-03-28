import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography, TextField, Button, Stack, Slider } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import FlipIcon from '@mui/icons-material/Flip';
import Cropper from "react-easy-crop";

const UploadImage = ({ onUpload, onClose }) => {
  const [assetName, setAssetName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSpace, setSelectedSpace] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedElements, setSelectedElements] = useState('');
  const [image, setImage] = useState(null);
  
  // Image editing states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(1);
  const [flipY, setFlipY] = useState(1);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  const handleSave = () => {
    onUpload({
      image: image,
      assetName,
      description,
      tags: {
        space: selectedSpace,
        style: selectedStyle,
        package: selectedPackage,
        elements: selectedElements
      }
    });
  };

  const handleFlipX = () => setFlipX(flipX * -1);
  const handleFlipY = () => setFlipY(flipY * -1);
  const handleRotation = () => setRotation((prev) => (prev + 90) % 360);

  return (
    <Box sx={{ 
      display: 'flex', 
      width: '1202px',
      height: '654px',
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#fff',
      zIndex: 1300,
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {/* Left side - Image Preview/Upload/Edit */}
      <Box sx={{ 
        width: '898px', 
        height: '654px',
        position: 'relative',
        backgroundColor: '#000'
      }}>
        {!image ? (
          <Box
            {...getRootProps()}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              height: '80%',
              border: "2px dashed #ccc",
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: "pointer",
              backgroundColor: isDragActive ? "rgba(255,255,255,0.1)" : "transparent",
            }}
          >
            <input {...getInputProps()} />
            <Typography sx={{ color: '#fff' }}>
              {isDragActive ? "Drop the image here..." : "Drag & drop an image, or click to select"}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ 
            width: '100%', 
            height: '100%', 
            position: 'relative',
            transform: `scaleX(${flipX}) scaleY(${flipY})`
          }}>
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={16/9}
              onCropChange={setCrop}
              onZoomChange={setZoom}
            />
            {/* Image editing controls */}
            <Box sx={{ 
              position: 'absolute', 
              bottom: 20, 
              left: '50%', 
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: 2,
              borderRadius: 2,
              display: 'flex',
              gap: 2,
              alignItems: 'center'
            }}>
              <Button 
                onClick={handleRotation}
                sx={{ color: 'white' }}
                startIcon={<RotateRightIcon />}
              >
                Rotate
              </Button>
              <Button 
                onClick={handleFlipX}
                sx={{ color: 'white' }}
                startIcon={<FlipIcon sx={{ transform: 'rotate(90deg)' }} />}
              >
                Flip X
              </Button>
              <Button 
                onClick={handleFlipY}
                sx={{ color: 'white' }}
                startIcon={<FlipIcon />}
              >
                Flip Y
              </Button>
              <Box sx={{ width: 150 }}>
                <Typography sx={{ color: 'white', mb: 1 }}>Zoom</Typography>
                <Slider
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e, value) => setZoom(value)}
                  sx={{ color: 'white' }}
                />
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* Right side - Form */}
      <Box sx={{ 
        width: '304px', 
        height: '654px', 
        p: 3, 
        borderLeft: '1px solid #eee',
        overflow: 'auto'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Add Asset</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              onClick={onClose}
              startIcon={<CloseIcon />}
            >
              Cancel
            </Button>
            <Button 
              variant="contained"
              startIcon={<CheckIcon />}
              onClick={handleSave}
              disabled={!image || !assetName || !description}
            >
              Save
            </Button>
          </Box>
        </Box>

        <TextField
          fullWidth
          label="Asset Name"
          value={assetName}
          onChange={(e) => setAssetName(e.target.value)}
          sx={{ mb: 2 }}
          placeholder="Asset 001"
        />

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
          placeholder="Enter Description"
        />

        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Tags</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Button 
                variant={selectedSpace ? "contained" : "outlined"}
                size="small"
                onClick={() => setSelectedSpace(selectedSpace ? '' : 'space')}
              >
                Space
              </Button>
              <Button 
                variant={selectedStyle ? "contained" : "outlined"}
                size="small"
                onClick={() => setSelectedStyle(selectedStyle ? '' : 'style')}
              >
                Style
              </Button>
              <Button 
                variant={selectedPackage ? "contained" : "outlined"}
                size="small"
                onClick={() => setSelectedPackage(selectedPackage ? '' : 'package')}
              >
                Package
              </Button>
              <Button 
                variant={selectedElements ? "contained" : "outlined"}
                size="small"
                onClick={() => setSelectedElements(selectedElements ? '' : 'elements')}
              >
                Elements
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default UploadImage;
