import { Injectable } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async validateUser(payload: JwtPayload) {
    const { username } = payload;
    const findUser = await this.userRepo.find({
      where: { username: username },
    });
    return findUser;
  }

  createToken(username, role) {
    const payload: JwtPayload = { username: username, role: role };
    const token = this.jwtService.sign(payload);
    return token;
  }
}
