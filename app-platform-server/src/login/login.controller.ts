import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) { }


  @Post()
  login(@Body() loginDto: LoginDto) {
    return this.loginService.login(loginDto)
  }
}
