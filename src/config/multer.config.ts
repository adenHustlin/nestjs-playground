import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';

export const MulterConfig = (folderName: string) => ({
  storage: diskStorage({
    destination: (request, file, callback) => {
      const uploadPath = `./assets/${folderName}`;

      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }

      callback(null, uploadPath);
    },

    filename: (req, file, callback) => {
      callback(null, `${uuid()}.${file.mimetype.split('/')[1]}`);
    },
  }),
});
