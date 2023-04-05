import { Column, Entity, ManyToOne, Relation } from 'typeorm';

import { CommonEntity } from './common.entity';
import { UserStateEnum } from './enums';
import { RoleEntity } from './role.entity';

@Entity('users')
export class UserEntity extends CommonEntity {
  @Column('varchar', { unique: true, nullable: true, length: 320 }) // username 64, domain 255 -> {64}@{255} = 320
  email: string | null;

  @Column('enum', { enum: UserStateEnum, default: UserStateEnum.Active })
  state: UserStateEnum;

  @Column('varchar', { nullable: true })
  hashPassword: string;

  @ManyToOne(() => RoleEntity, (role) => role.users)
  role: Relation<RoleEntity>;
}
