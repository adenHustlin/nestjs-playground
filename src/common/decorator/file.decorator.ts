import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MulterConfig } from '../../config/multer.config';
import { UseInterceptors } from '@nestjs/common';

export const fileInterceptor = (
  property: string,
  fileDir: string,
  multiple: boolean,
) => {
  const interceptor = multiple
    ? FilesInterceptor(property, undefined, MulterConfig(fileDir))
    : FileInterceptor(property, MulterConfig(fileDir));
  return UseInterceptors(interceptor);
};
