import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) { }

  @UseGuards(AuthGuard('jwt')) // 使用 'JWT' 进行验证
  @Post('/register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const authResult = await this.authService.validateUser(
      loginDto.account,
      loginDto.password,
    );
    if (authResult.error()) {
      return authResult
    }
    return this.authService.certificate(authResult.getValue())
  }

}
