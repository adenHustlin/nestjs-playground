import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterConfig } from '../../config/multer.config';

export const fileInterceptor = (property: string, fileDir: string) =>
  UseInterceptors(FileInterceptor(property, MulterConfig(fileDir)));
