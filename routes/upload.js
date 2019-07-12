const multer = require('multer');
const path   = require('path');
/** Storage Engine */
const storageEngine = multer.diskStorage({
  destination: './public/files',
  filename: function(req, file, fn){
    fn(null,  file.originalname);
  }
}); 
//init
const upload =  multer({
  storage: storageEngine,
  limits: { fileSize:20000000 },
  fileFilter: function(req, file, callback){
    validateFile(file, callback);
  }
}).single('file');
  var validateFile = function(file, cb ){
    console.log('photo');
  allowedFileTypes = /|docx|js|json|docs|doc|pdf/;
  const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType  = allowedFileTypes.test(file.mimetype);
  if(extension && mimeType){
      return cb(null, true);
  }else{
    cb("Invalid file type. ")
  }
}
module.exports = upload;