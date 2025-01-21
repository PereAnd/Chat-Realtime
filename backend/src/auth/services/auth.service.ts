import { Injectable } from '@nestjs/common';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/business-errors';
import { User } from 'src/user/entity/user';
import { UserService } from 'src/user/services/user.service';
import { compare } from 'bcrypt';
import { ResUserDto } from 'src/user/dto/res-user-dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, pwd: string) {
    const userFind: User = await this.userService.findByEmail(email);
    if (!userFind) {
      throw new BusinessLogicException(
        'User not found',
        BusinessError.NOT_FOUND,
      );
    }

    const isOkPwd: boolean = await compare(pwd, userFind.pwd);
    if (!isOkPwd) {
      throw new BusinessLogicException(
        'Credentials invalid',
        BusinessError.UNAUTHORIZED,
      );
    }
    const responseDto: any = ResUserDto.instanceToDto(userFind);
    return {
      ...responseDto,
      token: this.jwtService.sign(responseDto),
    };
  }
}
