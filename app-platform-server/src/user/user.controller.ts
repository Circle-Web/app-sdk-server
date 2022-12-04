import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) { }

  @Post('/register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto.username, createUserDto.account, createUserDto.password);
  }

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    console.log(111)
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
