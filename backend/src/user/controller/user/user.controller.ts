import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { ReqCreateUserDto } from 'src/user/dto/req-create-user-dto';
import { ReqUpdateUserDto } from 'src/user/dto/req-update-user-dto';
import { ResUserDto } from 'src/user/dto/res-user-dto';
import { User } from 'src/user/entity/user';
import { UserService } from 'src/user/services/user.service';

@Controller('users')
@UseInterceptors(BusinessErrorsInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAlll() {
    const users: User[] = await this.userService.findAll();
    return users.map((user) => ResUserDto.instanceToDto(user));
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return ResUserDto.instanceToDto(await this.userService.findById(id));
  }

  @Post()
  async create(@Body() createUserDto: ReqCreateUserDto) {
    const user: User = plainToInstance(User, createUserDto);
    return ResUserDto.instanceToDto(await this.userService.create(user));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() newData: ReqUpdateUserDto) {
    return ResUserDto.instanceToDto(
      await this.userService.update(id, newData as User),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param(':id') id: string) {
    return await this.userService.delete(id);
  }
}
