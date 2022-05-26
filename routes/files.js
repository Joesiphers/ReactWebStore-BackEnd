const multer  = require('multer')
const mulForm = multer({ dest: 'uploads/' })


module.exports=mulForm;