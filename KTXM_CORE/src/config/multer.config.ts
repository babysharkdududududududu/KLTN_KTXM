import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { mkdirSync } from 'fs';

export const multerConfig = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            const studentId = req.body.userId; // Lấy mã sinh viên từ body
            let uploadPath: string; // Khai báo kiểu cho uploadPath
            if (process.env.NODE_ENV === 'development') {
                // Chạy trên máy của bạn
                uploadPath = join(__dirname, '..', '..', '..', 'KLTN_WEB', 'public', 'upload', studentId);
            } else {
                // Chạy trên server
                uploadPath = join(__dirname, '..', '..', '..', 'KLTN_WEB', 'build', 'upload', studentId);
            }
            // Tạo thư mục nếu chưa tồn tại
            mkdirSync(uploadPath, { recursive: true });

            cb(null, uploadPath); // Gán đường dẫn thư mục
            console.log('Upload path:', uploadPath);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname)); // Đặt tên file
            // log file name and file path
            console.log('file name: ', file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
        },
    }),
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'application/pdf',       // Định dạng PDF
            'application/msword',    // Định dạng Word (DOC)
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Định dạng Word (DOCX)
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ cho phép tải lên hình ảnh (JPEG, PNG, GIF), PDF và Word (DOC, DOCX)'), false);
        }
    },
};
