const multer = require("multer");
const sharp = require("sharp");
const errorHandler = require("../Utils/errorController");
const config = require("../Helpers/config.helper");
const path = require("path");
const fs = require("fs");

function checkFiles(file, dir) {
  const fileFolder = fs.readdirSync(dir);
  let found = false;
  for (let i = 0; i < fileFolder.length; i++) {
    if (file.originalname === fileFolder[i]) found = true;
  }

  return found;
}

module.exports = {
  // isImage
  isImage: (uploadFile) => {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        fs.mkdir(config.dirImage, { recursive: true }, (err) => {
          if (err) {
            return console.error(err);
          }
        });
        cb(null, config.dirImage);
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "")); // rename file
      },
    });

    let attachment = [];
    // Filter Only Image are allowed;
    const fileFilter = (req, file, cb) => {
      if (file.fieldname === uploadFile) {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
          req.fileValidationError = {
            message: "Only image files are allowed!",
          };
          return cb(new Error("Only image files are allowed!"), false);
        }
        if (checkFiles(file, config.dirImage)) {
          attachment.push(file.originalname)
          cb(null, false);
        } else {
          cb(null, true);
        }
      }
    };

    // Max Size 5MB
    const sizeMB = 5;
    const maxSize = sizeMB * 1000 * 1000;

    const upload = multer({
      storage,
      fileFilter,
      limits: { fileSize: maxSize },
    }).fields([{ name: uploadFile, maxCount: 5 }]);

    return (req, res, next) => {
      upload(req, res, (error) => {
        req.files.saved = attachment
        if (req.fileValidationError)
          return res.status(400).send(req.fileValidationError);

        // if (!req.files && !error)
        //   return res.status(400).send({
        //     message: "Please select files to upload",
        //   });

        if (error) {
          if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).send({
              message: "max file size 5MB",
            });
          }
          return res.status(400).send(error);
        }
        console.log("success upload!");
        return next();
      });
      attachment = [];
    };
  },
  // End isImage
  // isAttachement
  isAttachment: (uploadFile) => {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        if (file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
          fs.mkdir(config.dirImage, { recursive: true }, (err) => {
            if (err) {
              return console.error(err);
            }
          });
          cb(null, config.dirImage);
        } else if (file.originalname.match(/\.(pdf|PDF)$/)) {
          fs.mkdir(config.dirPDF, { recursive: true }, (err) => {
            if (err) {
              return console.error(err);
            }
          });
          cb(null, config.dirPDF);
        }
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "")); // rename file
      },
    });

    let attachment = [];
    // Filter Only Image are allowed;
    const fileFilter = (req, file, cb) => {
      if (file.fieldname === uploadFile) {
        if (
          !file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|pdf|PDF)$/)
        ) {
          req.fileValidationError = {
            message: "Only images and PDF files are allowed!",
          };
          return cb(new Error("Only images and PDF files are allowed!"), false);
        }

        let dir;
        if (file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
          dir = config.dirImage;
        } else if (file.originalname.match(/\.(pdf|PDF)$/)) {
          dir = config.dirPDF;
        }

        if (checkFiles(file, dir)) {
          attachment.push(file.originalname)
          cb(null, false);
        } else {
          cb(null, true);
        }
      }
    };

    // Max Size 5MB
    const sizeMB = 5;
    const maxSize = sizeMB * 1000 * 1000;

    const upload = multer({
      storage,
      fileFilter,
      limits: { fileSize: maxSize },
    }).fields([{ name: uploadFile, maxCount: 5 }]);

    return (req, res, next) => {
      upload(req, res, (error) => {
        req.files.saved = attachment
        if (req.fileValidationError)
          return res.status(400).send(req.fileValidationError);

        // if (!req.files && !error)
        //   return res.status(400).send({
        //     message: "Please select files to upload",
        //   });

        if (error) {
          if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).send({
              message: "max file size 5MB",
            });
          }
          return res.status(400).send(error);
        }
        console.log("success upload!");
        return next();
      });
      attachment = [];
    };
  },
  // End isAttachment
  // isComperss
  isCompress: (req, res, next) => {
    try {
      if (req.files.attachment) {
        req.files.attachment.map((image) => {
          if (image.filename.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
            if (/CP-/.test(image.filename) === false) {
              const filepathCompress =
                image.destination + "/CP-" + image.filename;
              sharp(image.path)
                .jpeg({ quality: 80 })
                .toFile(filepathCompress, (err, info) => {
                  if (err) {
                    console.log(err);
                    return errorHandler(err, req, res);
                  } else {
                    fs.unlinkSync(image.path);
                  }
                });
            }
          }
        });
      }
      return next();
    } catch (error) {
      console.log(error);
      return errorHandler(error, req, res);
    }
  },
  // End isCompress
  isCSV: (uploadFile) => {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        fs.mkdir(config.dirCSV, { recursive: true }, (err) => {
          if (err) {
            return console.error(err);
          }
        });
        cb(null, config.dirCSV);
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "")); // rename file
      },
    });

    // Filter Only Image are allowed;
    const fileFilter = (req, file, cb) => {
      if (file.fieldname === uploadFile) {
        if (!file.originalname.match(/\.(csv|CSV|xlsx|XLSX)$/)) {
          req.fileValidationError = {
            message: "Only CSV files are allowed!",
          };
          return cb(new Error("Only CSV files are allowed!"), false);
        }
      }
      cb(null, true);
    };

    // Max Size 5MB
    const sizeMB = 50;
    const maxSize = sizeMB * 1000 * 1000;

    const upload = multer({
      storage,
      fileFilter,
      limits: { fileSize: maxSize },
    }).fields([{ name: uploadFile, maxCount: 1 }]);

    return (req, res, next) => {
      upload(req, res, (error) => {
        if (req.fileValidationError)
          return res.status(400).send(req.fileValidationError);

        // if (!req.files && !error)
        //   return res.status(400).send({
        //     message: "Please select files to upload",
        //   });

        if (error) {
          if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).send({
              message: "max file size 10MB",
            });
          }
          return res.status(400).send(error);
        }
        console.log("success upload!");
        return next();
      });
    };
  },
  // isAttachement
  isMultipleAttachment: (
    uploadFile1,
    uploadFile2,
    uploadFile3,
    uploadFile4,
    uploadFile5,
    uploadFile6,
    uploadFile7,
    uploadFile8,
    uploadFile9,
    uploadFile10,
    uploadFile11,
    uploadFile12,
    uploadFile13,
    uploadFile14,
  ) => {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        if (file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
          fs.mkdir(config.dirImage, { recursive: true }, (err) => {
            if (err) {
              return console.error(err);
            }
          });
          cb(null, config.dirImage);
        } else if (file.originalname.match(/\.(pdf|PDF)$/)) {
          fs.mkdir(config.dirPDF, { recursive: true }, (err) => {
            if (err) {
              return console.error(err);
            }
          });
          cb(null, config.dirPDF);
        }
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "")); // rename file
      },
    });

    let saved = {};

    // Filter Only Image are allowed;
    const fileFilter = (req, file, cb) => {
      if (
        file.fieldname === uploadFile1 ||
        file.fieldname === uploadFile2 ||
        file.fieldname === uploadFile3 ||
        file.fieldname === uploadFile4 ||
        file.fieldname === uploadFile5 ||
        file.fieldname === uploadFile6 ||
        file.fieldname === uploadFile7 ||
        file.fieldname === uploadFile8 ||
        file.fieldname === uploadFile9 ||
        file.fieldname === uploadFile10 ||
        file.fieldname === uploadFile11 ||
        file.fieldname === uploadFile12 ||
        file.fieldname === uploadFile13 ||
        file.fieldname === uploadFile14
      ) {
        if (
          !file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|pdf|PDF)$/)
        ) {
          req.fileValidationError = {
            message: "Only images and PDF files are allowed!",
          };
          return cb(new Error("Only images and PDF files are allowed!"), false);
        }
      }

      let dir;
      if (file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
        dir = config.dirImage;
      } else if (file.originalname.match(/\.(pdf|PDF)$/)) {
        dir = config.dirPDF;
      }

      if (checkFiles(file, dir)) {
        if (saved[file.fieldname]) {
          saved[file.fieldname].push(file.originalname)
        } else {
          saved[file.fieldname] = [file.originalname];
        }
        cb(null, false);
      } else {
        cb(null, true);
      }
    };

    // Max Size 5MB
    const sizeMB = 5;
    const maxSize = sizeMB * 1000 * 1000;

    const upload = multer({
      storage,
      fileFilter,
      limits: { fileSize: maxSize },
    }).fields([
      { name: uploadFile1 },
      { name: uploadFile2 },
      { name: uploadFile3 },
      { name: uploadFile4 },
      { name: uploadFile5 },
      { name: uploadFile6 },
      { name: uploadFile7 },
      { name: uploadFile8 },
      { name: uploadFile9 },
      { name: uploadFile10 },
      { name: uploadFile11 },
      { name: uploadFile12 },
      { name: uploadFile13 },
      { name: uploadFile14 },
    ]);

    return (req, res, next) => {
      upload(req, res, (error) => {
        req.files.saved = saved;
        if (req.fileValidationError)
          return res.status(400).send(req.fileValidationError);

        // if (!req.files && !error)
        //   return res.status(400).send({
        //     message: "Please select files to upload",
        //   });

        if (error) {
          if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).send({
              message: "max file size 5MB",
            });
          }
          return res.status(400).send(error);
        }
        return next();
      });
      saved = {};
    };
  },
  // End isAttachment
  isCompressMultiple: (req, res, next) => {
    try {
      const savedFiles = req.files.saved;
      delete req.files.saved;

      Object.keys(req.files).map((item) => {
        req.files[item].map((image) => {
          if (image.filename.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
            if (/CP-/.test(image.filename) === false) {
              const filepathCompress = image.destination + "/CP-" + image.filename;
              sharp(image.path)
                .jpeg({ quality: 80 })
                .toFile(filepathCompress, (err, info) => {
                  if (err) {
                    console.log(err);
                    return errorHandler(err, req, res);
                  } else {
                    fs.unlinkSync(image.path);
                  }
                });
            }
          }
        })
      })
      req.files.saved = savedFiles;
      return next();
    } catch (error) {
      console.log(error);
      return errorHandler(error, req, res);
    }
  },
  // End isCompress Multiple
};
