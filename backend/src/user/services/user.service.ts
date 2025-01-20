import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/business-errors';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findById(id: string): Promise<User> {
    const user: User = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new BusinessLogicException(
        'User not found',
        BusinessError.NOT_FOUND,
      );
    }
    return user;
  }

  async create(user: User): Promise<User> {
    user.pwd = await this.hashPwd(user.pwd);
    return await this.userRepository.save(user);
  }

  async update(id: string, newData: User): Promise<User> {
    const userSaved: User = await this.userRepository.findOne({
      where: { id },
    });
    if (!userSaved) {
      throw new BusinessLogicException(
        'User not found',
        BusinessError.NOT_FOUND,
      );
    }
    if (newData.pwd != null) {
      newData.pwd = await this.hashPwd(newData.pwd);
    }
    Object.assign(userSaved, newData);
    return await this.userRepository.save(userSaved);
  }

  async delete(id: string) {
    const userSaved: User = await this.userRepository.findOne({
      where: { id },
    });
    if (!userSaved) {
      throw new BusinessLogicException(
        'User not found',
        BusinessError.NOT_FOUND,
      );
    }

    await this.userRepository.remove(userSaved);
  }

  async hashPwd(pwd: string): Promise<string> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(pwd, saltOrRounds);
    return hash;
  }
}
