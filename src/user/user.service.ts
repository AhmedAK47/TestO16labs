import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { UserDtoForSignIn, UserDtoForSignUp } from 'src/dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    private authService: AuthService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async signUp(user: UserDtoForSignUp) {
    const [findUser] = await this.userRepo.find({
      where: { username: user.username },
    });
    if (findUser) {
      throw new HttpException('user already exist', HttpStatus.BAD_REQUEST);
    }
    const data = await this.userRepo.save(user);
    const token = this.authService.createToken(data.username, data.role);
    return token;
  }

  async signIn(user: UserDtoForSignIn) {
    const [findUser] = await this.userRepo.find({
      where: {
        username: user.username,
        password: user.password,
      },
    });
    if (findUser){
      return { toekn:this.authService.createToken(findUser.username, findUser.role)}
    }
    throw new HttpException('user does not exit', HttpStatus.NOT_FOUND);
  }
  async findUser(username) {
    return await this.userRepo.findOne({ where: { username: username } });
  }
}
