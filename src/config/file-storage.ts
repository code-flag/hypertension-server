import dotenv from "dotenv";
import { Request } from "express";
import path from "path";
dotenv.config();

const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3');


aws.config.update({
    secretAccessKey: process.env.AWS_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION,
});

// bucket - WE CAN PASS SUB FOLDER NAME ALSO LIKE 'bucket-name/sub-folder1'
const BucketFolder_1 = `${process.env.AWS_S3_BUCKET}/jvs/test-pic`;
const BucketFolder_2 = `${process.env.AWS_S3_BUCKET}/jvs/test-documents`;
export const s3 = new aws.S3();

export const uploadProfilePic = multer({
    storage: multerS3({
        s3: s3,
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        // 'attachment' for download when view in browser and inline for preview in browser
        contentDisposition: process.env?.AWS_CONTENT_DISPOSITION ?? 'inline', 
        // META DATA FOR PUTTING FIELD NAME
        metadata: (req: Request, file: any, cb: any) => {
            cb(null, { fieldName: file.fieldname });
        },
        bucket: BucketFolder_1,
        key: (req: Request, file: any, cb: any) => {
            console.log(file);
            cb(null, new Date().toISOString()  + '-' + file.originalname)
        }
    }),

    // SET DEFAULT FILE SIZE UPLOAD LIMIT
    limits: { fileSize: 1024 * 1024 * 50 }, // 50MB
    // FILTER OPTIONS LIKE VALIDATING FILE EXTENSION
    fileFilter: function(req: Request, file: any, cb: any) {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb("Error: Only jpeg|jpg|png extention type of image are allowed!");
        }
    }
})

export const uploadAttachmentDocument = multer({
    storage: multerS3({
        s3: s3,
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        // 'attachment' for download when view in browser and inline for preview in browser
        contentDisposition: process.env?.AWS_CONTENT_DISPOSITION ?? 'inline', 
        metadata: (req: Request, file: any, cb: any) => {
            cb(null, { fieldName: file.fieldname });
        },
        bucket: BucketFolder_2,
        key: (req: Request, file: any, cb: any) => {
            console.log(file);
            cb(null, new Date().toISOString()  + '-' + file.originalname)
        }
    }),

    // SET DEFAULT FILE SIZE UPLOAD LIMIT
    limits: { fileSize: 1024 * 1024 * 50 }, // 5MB
    // FILTER OPTIONS LIKE VALIDATING FILE EXTENSION
    fileFilter: function(req: Request, file: any, cb: any) {
        const filetypes = /jpeg|jpg|png|svg|txt|pdf|docx|doc|csv|xlsx|ppt|pptx|xls/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb("Error: Allowed images are of extensions jpeg|jpg|png|pdf|docx|doc|csv|ppt|pptx|xlsx|xls !");
        }
    }
})

export const uploadBigAttachmentDocument = multer({
    storage: multerS3({
        s3: s3,
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        // 'attachment' for download when view in browser and inline for preview in browser
        contentDisposition: process.env?.AWS_CONTENT_DISPOSITION ?? 'inline', 
        // META DATA FOR PUTTING FIELD NAME
        metadata: (req: Request, file: any, cb: any) => {
            cb(null, { fieldName: file.fieldname });
        },
        bucket: BucketFolder_2,
        key: (req: Request, file: any, cb: any) => {
            console.log(file);
            cb(null, new Date().toISOString()  + '-' + file.originalname)
        }
    }),

    // SET DEFAULT FILE SIZE UPLOAD LIMIT
    limits: { fileSize: 1024 * 1024 * 200 }, // 20MB
    // FILTER OPTIONS LIKE VALIDATING FILE EXTENSION
    fileFilter: function(req: Request, file: any, cb: any) {
        const filetypes = /jpeg|jpg|png|pdf|svg|txt|docx|doc|csv|ppt|pptx|xlsx|xls/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb("Error: Allowed images are of extensions jpeg|jpg|png|pdf|docx|doc|csv|xlsx|xls only!");
        }
    }
})