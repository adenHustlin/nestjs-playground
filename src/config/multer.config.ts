import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';

export const MulterConfig = (folderName: string) => ({
  storage: diskStorage({
    destination: `./assets/${folderName}`,
    filename: (req, file, callback) => {
      callback(null, `${uuid()}.${file.mimetype.split('/')[1]}`);
    },
  }),
});
