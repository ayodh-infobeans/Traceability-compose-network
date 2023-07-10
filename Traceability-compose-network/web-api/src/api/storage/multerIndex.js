
import multer from 'multer';

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the directory where you want to store the uploaded files
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    
    // Generate a unique filename for the uploaded file
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Create the multer instances
const upload = multer({ storage: storage });


export default upload;





