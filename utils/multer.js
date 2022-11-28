const path = require('path');
const multer_upload = require("multer");


//storage engine
// const storage = multer_upload.diskStorage({
//     destination:  './upload/images',
//     filename: (req, file, cb ) => {
//         return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
//     }
// })

 

//image upload
const upload =  multer_upload({
    dest:'./upload/images',

    
})


module.exports = upload;
     

// storage: storage,
    
//     filefilter:(req,file,cb) => {
//         const fileTypes = /jpeg|jpg|png/
//         const mimeType = fileTypes.test(file.mimeType)
//         const extname = fileTypes.test(file.originalname)

//         if (mimeType && extname){
//             return cb(null,true)
//         }
//         else{
//             cb('Give proper files formate to')
//         }
//     } 