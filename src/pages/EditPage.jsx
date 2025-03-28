import ImageEditorDrawer from '../components/ImageEditorDrawer';

const EditPage = ({ image, onSave, onClose }) => {
  return (
    <ImageEditorDrawer
      open={true}
      image={image?.image}
      onSave={onSave}
      onClose={onClose}
    />
  );
};

export default EditPage; 