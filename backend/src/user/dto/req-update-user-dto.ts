import { PartialType } from '@nestjs/mapped-types';
import { ReqCreateUserDto } from './req-create-user-dto';

export class ReqUpdateUserDto extends PartialType(ReqCreateUserDto) {}
