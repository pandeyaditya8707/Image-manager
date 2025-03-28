import { ImageList, ImageListItem, Box, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import EditIcon from '@mui/icons-material/Edit';

const ImageGallery = ({ images, onEditImage }) => {
  return (
    <Box sx={{ mt: 3, width: '100%', minHeight: 300 }}>
      <ImageList variant="masonry" cols={3} gap={8}>
        {images.map((item, index) => (
          <ImageListItem 
            key={index} 
            component={motion.div}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: index * 0.1
            }}
            sx={{ position: 'relative' }}
          >
            <motion.img
              src={item.image}
              alt={item.metadata.assetName}
              loading="lazy"
              style={{
                borderRadius: "8px",
                width: '100%',
                height: 'auto',
                boxShadow: "0px 3px 10px rgba(0,0,0,0.2)",
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.5)',
                opacity: 0,
                transition: '0.3s',
                borderRadius: "8px",
                '&:hover': {
                  opacity: 1
                }
              }}
            >
              <IconButton 
                onClick={() => onEditImage(item)}
                sx={{ 
                  color: 'white',
                  '&:hover': { 
                    backgroundColor: 'rgba(255,255,255,0.2)' 
                  }
                }}
              >
                <EditIcon />
              </IconButton>
            </Box>
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

export default ImageGallery;
