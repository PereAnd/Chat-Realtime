import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserType {
  STUDENT = 'STUDENT',
  MODERATOR = 'MODERATOR',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  pwd: string;

  @Column()
  type: UserType;
}
