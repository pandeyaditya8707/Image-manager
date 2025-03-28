import { motion } from "framer-motion";
import { Box, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import emptyBoxImage from '../assets/PHOTO-2025-03-28-13-47-13.jpg';

const HomePage = ({ onAddClick }) => {
  const boxVariants = {
    initial: { 
      rotateX: 0,
      rotateY: 0,
      scale: 1
    },
    animate: { 
      rotateX: [0, 10, 0],
      rotateY: [0, 360, 0],
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        ease: "easeInOut",
        times: [0, 0.5, 1]
      }
    }
  };

  return (
    <Box sx={{ textAlign: "center", mt: 5, overflow: 'hidden', perspective: '1000px' }}>
      <motion.div
        initial="initial"
        whileHover="animate"
        variants={boxVariants}
        style={{ 
          transformStyle: 'preserve-3d',
          display: 'inline-block',
          marginBottom: '2rem',
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}
      >
        <img 
          src={emptyBoxImage} 
          alt="Empty Box" 
          style={{
            width: '200px',
            height: 'auto',
            marginBottom: '1rem'
          }}
        />
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddClick}
            sx={{
              backgroundColor: '#1a237e',
              '&:hover': {
                backgroundColor: '#0d47a1',
              },
              fontWeight: 'bold',
              px: 3,
              py: 1
            }}
          >
            ADD
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
};

export default HomePage; 