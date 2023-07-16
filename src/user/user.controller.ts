import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDtoForSignIn, UserDtoForSignUp } from 'src/dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('signup')
  async signUp(@Body() body: UserDtoForSignUp) {
    return await this.userService.signUp(body);
  }

  @Post('signin')
  async signIn(@Body() body: UserDtoForSignIn) {
    return await this.userService.signIn(body);
  }
}
