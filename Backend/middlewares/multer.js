// import multer from 'multer'

// const upload = multer({
//     storage: multer.memoryStorage(),

// })

// export default upload
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
