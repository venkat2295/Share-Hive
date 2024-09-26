import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

// Constants
const MAX_FILE_SIZE = 1 * 1000000; // 1MB
const ALLOWED_FILE_TYPES = ['.png', '.jpg', '.jpeg'];
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = req.user && req.user.role === 'admin' 
      ? path.join(__dirname, "../uploads")
      : path.join(__dirname, "../uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const userId = req.user ? req.user.id : 'unknown';
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    cb(null, `${userId}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_FILE_TYPES.includes(ext) || !ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new Error(`Invalid file type. Only ${ALLOWED_FILE_TYPES.join(', ')} formats are allowed.`));
  }
  cb(null, true);
};

const uploadPicture = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: fileFilter,
});

// Custom error handling
uploadPicture.handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: `File size should be less than ${MAX_FILE_SIZE / 1000000}MB` });
    }
  }
  next(err);
};

export { uploadPicture };