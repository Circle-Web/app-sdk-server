import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ReviewDto } from './dto/update-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  // @UseGuards(AuthGuard('jwt')) // 使用 'JWT' 进行验证
  @Post('/review')
  register(@Body() reviewDto: ReviewDto) {
    return this.adminService.review(reviewDto.extUuid, reviewDto.state);
  }


}
