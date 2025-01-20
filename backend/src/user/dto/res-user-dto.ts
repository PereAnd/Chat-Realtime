import { IsString, IsNotEmpty, IsEmail, IsEnum } from 'class-validator';
import { User, UserType } from '../entity/user';

export class ResUserDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

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

  @IsEnum(UserType)
  @IsNotEmpty()
  readonly type: UserType;

  public static instanceToDto(user: User): ResUserDto {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      type: user.type,
    } as ResUserDto;
  }
}
