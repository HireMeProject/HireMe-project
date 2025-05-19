// fileUpload.js
const path = require("path");
const multer = require("multer");

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads")); // Separate directory
  },
  filename: function (req, file, cb) {
    if (file) {
      cb(null, new Date().toISOString().replace(/:/g, "-") +  file.originalname);
    } else {
      cb(null, false);
    }
  },
});

const fileUpload = multer({
  storage: fileStorage,
  fileFilter: function (req, file, cb) {
    // Accept specific file types if you want
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      console.log("allowedtypes includes ? ",allowedTypes.includes(file.mimetype));
      console.log("mimetype file uploaded : ",file.mimetype);
      cb(null, true);
    } else {
      cb({ message: "Unsupported file format" }, false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

module.exports = fileUpload;
// const multer  = require('multer')

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       //where to store the file
//       cb(null, "uploads/");
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now();
//         cb(null, uniqueSuffix + file.originalname);
//       },
//   });
  
//   const fileFilter = (req, file, cb) => {
//     //reject a file if it's not a jpg or png
//     if (
//       file.mimetype === "application/pdf"
//     ) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//     }
//   };
//   const upload = multer({
//     storage: storage,
//     limits: {
//       fileSize: 1024 * 1024 * 5,
//     },
//     fileFilter: fileFilter,
//   });
//   module.exports = upload;



// const multer = require('multer');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // Dossier où les CV seront stockés
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + '-' + file.originalname); // Nom de fichier unique
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === "application/pdf") {
//     cb(null, true); // Accepter uniquement les PDF
//   } else {
//     cb(new Error("Seuls les fichiers PDF sont autorisés"), false);
//   }
// };

// const uploadCV = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // Limite à 5 Mo
//   fileFilter: fileFilter,
// }).single("cv"); // Le champ du formulaire doit s'appeler "cv"



// module.exports = uploadCV;