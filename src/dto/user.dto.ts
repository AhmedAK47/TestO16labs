import { IsNotEmpty, IsString } from 'class-validator';
import { Role } from './role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UserDtoForSignUp {
  @ApiProperty({
    example: 'user@123',
    description: 'user name should be unique of every time',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'Acb1234@$',
    description: 'password should contain special charactor',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ enum: ['admin', 'user'] })
  @IsNotEmpty()
  role: Role;
}

export class UserDtoForSignIn {
  @ApiProperty({
    example: 'user@123',
    description: 'user name should be unique of every time',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'Acb1234@$',
    description: 'password should contain special charactor',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
