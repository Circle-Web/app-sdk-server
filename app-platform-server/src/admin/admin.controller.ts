import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto/create-admin.dto';
import { ReviewDto } from './dto/update-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService,
    private readonly authService: AuthService) { }


  @Post('/login')
  async login(@Body() loginDto: AdminLoginDto) {
    const authResult = await this.authService.validateUser(
      loginDto.account,
      loginDto.password,
    );
    if (authResult.error()) {
      return authResult
    }
    return this.authService.certificate(authResult.getValue())
  }

  // @UseGuards(AuthGuard('jwt')) // 使用 'JWT' 进行验证
  @Post('/review')
  register(@Body() reviewDto: ReviewDto) {
    return this.adminService.review(reviewDto.extUuid, reviewDto.state);
  }
}
