import { Body, Controller, FileTypeValidator, ParseFilePipe, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadExtCodeService } from './upload-ext-code.service';

@Controller('api/extUploadProxy')
export class UploadExtCodeController {
  constructor(
    private readonly uploadExtCodeService: UploadExtCodeService,
  ) { }

  @Post('routeUploadSourceFile')
  @UseInterceptors(FileInterceptor('file'))
  upload(@Req() request, @UploadedFile(new ParseFilePipe({
    validators: [
      new FileTypeValidator({ fileType: 'zip' }),
    ],
  }),) file, @Body() body) {
    return this.uploadExtCodeService.upload(request.user.id, file, body);
  }
}
