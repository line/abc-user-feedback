import { Column, Entity, OneToMany, Relation } from 'typeorm';

import { CommonEntity } from './common.entity';
import { PermissionEnum } from './enums';
import { UserEntity } from './user.entity';

@Entity('roles')
export class RoleEntity extends CommonEntity {
  @Column('varchar', { length: 255, unique: true })
  name: string;

  @Column('simple-array')
  permissions: PermissionEnum[];

  @OneToMany(() => UserEntity, (user) => user.role)
  users: Relation<UserEntity>[];
}
