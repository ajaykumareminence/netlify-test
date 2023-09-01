import multer from "multer";
import reply from "./reply.js";

var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, `uploads/`)
    },
    filename: function(req,file,cb){
        cb(null, Date.now()+file.originalname)
    }
})

const fileFilter = (req,file,cb) =>{
    if (isImageFile(file.originalname)) {
        cb(null, true);
    } else {
        cb(new Error('Not an image file'));
    }
}

function isImageFile(filename) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
    const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();
    return imageExtensions.includes(ext);
}
export const upload = multer({
    storage: storage,
    limits: { fileSize: 500 * 1024 },
    fileFilter: fileFilter
})

export function handleUpload(req, res, next) {
    upload.single('file')(req, res, async (err) => {
        console.log(req.file)
        if(err){
            return res.send(reply.failed(`Err: ${err.message}`))
        }
        next(); // Continue to the next middleware or route handler
    });
}
