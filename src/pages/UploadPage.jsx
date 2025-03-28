import UploadImage from '../components/UploadImage';

const UploadPage = ({ onUpload, onClose }) => {
  return <UploadImage onUpload={onUpload} onClose={onClose} />;
};

export default UploadPage; 