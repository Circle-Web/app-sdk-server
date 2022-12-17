import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ExtQueryModule } from 'src/app-store/ext-query/ext-query.module';
import { UploadExtCodeController } from './upload-ext-code.controller';
import { UploadExtCodeService } from './upload-ext-code.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        // 配置参数
        return {
          storage: diskStorage({
            // 配置文件上传后的文件夹路径
            destination: (req, file, cb) => {
              return cb(null, config.get("app.extCodePath"))
            },
            // filename: (req, file, cb) => {
            //   // 在此处自定义保存后的文件名称
            //   const filename = `${+new Date}.${file.mimetype.split('/')[1]}`;
            //   return cb(null, filename);
            // },
          }),
        }
      },
    }),
    ExtQueryModule,
  ],
  controllers: [UploadExtCodeController],
  providers: [UploadExtCodeService]
})
export class UploadExtCodeModule { }
