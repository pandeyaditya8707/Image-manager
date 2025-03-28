import { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  Stack,
  useTheme,
  useMediaQuery 
} from "@mui/material";
import { motion } from "framer-motion";
import ImageGallery from '../components/ImageGallery';
import ImageEditorDrawer from '../components/ImageEditorDrawer';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

const GalleryPage = ({ images, onAddMore, onUpdateImage }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditorOpen, setEditorOpen] = useState(false);

  const handleEditImage = (image) => {
    setSelectedImage(image);
    setEditorOpen(true);
  };

  const handleSaveEdit = (editedImage) => {
    onUpdateImage(selectedImage, editedImage);
    setEditorOpen(false);
    setSelectedImage(null);
  };

  const filteredAndSortedImages = images
    .filter(img => 
      img.metadata.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.metadata.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return 1;
        case 'a-z':
          return a.metadata.assetName.localeCompare(b.metadata.assetName);
        case 'z-a':
          return b.metadata.assetName.localeCompare(a.metadata.assetName);
        case 'newest':
        default:
          return -1;
      }
    });

  return (
    <Box sx={{ mt: isMobile ? 2 : 3 }}>
      <Stack 
        direction={isMobile ? "column" : "row"} 
        spacing={2} 
        alignItems={isMobile ? "stretch" : "center"}
        justifyContent="space-between"
        sx={{ mb: isMobile ? 2 : 3 }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddMore}
          fullWidth={isMobile}
          sx={{
            backgroundColor: '#1a237e',
            '&:hover': {
              backgroundColor: '#0d47a1',
            }
          }}
        >
          Add More
        </Button>

        <Stack 
          direction={isMobile ? "column" : "row"} 
          spacing={1} 
          sx={{ width: isMobile ? '100%' : 'auto' }}
        >
          <TextField
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size={isMobile ? "small" : "medium"}
            fullWidth={isMobile}
            sx={{ width: isMobile ? '100%' : 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            size={isMobile ? "small" : "medium"}
            fullWidth={isMobile}
            sx={{ width: isMobile ? '100%' : 120 }}
          >
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
            <MenuItem value="a-z">A-Z</MenuItem>
            <MenuItem value="z-a">Z-A</MenuItem>
          </Select>
        </Stack>
      </Stack>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ImageGallery 
          images={filteredAndSortedImages} 
          onEditImage={handleEditImage}
        />
      </motion.div>

      <ImageEditorDrawer
        open={isEditorOpen}
        image={selectedImage?.image}
        onClose={() => {
          setEditorOpen(false);
          setSelectedImage(null);
        }}
        onSave={handleSaveEdit}
      />
    </Box>
  );
};

export default GalleryPage; 