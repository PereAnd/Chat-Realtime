import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserType } from '../entity/user';

export class ReqCreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly pwd: string;

  @IsEnum(UserType, {
    message: 'type must be one of the following values: STUDENT, MODERATOR',
  })
  @IsNotEmpty()
  readonly type: UserType;
}
