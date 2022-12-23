import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Generated,
  OneToMany,
} from 'typeorm';
import { DefaultColumns } from './common/default.columns';
import { UserToSpace } from './user-to-space.entity';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';

@Entity({ name: 'user' })
export class User extends DefaultColumns {
  @Column({ type: 'varchar', unique: true })
  @Exclude()
  email: string;

  @Column({ type: 'varchar' })
  @Exclude()
  pw: string;

  @Column({ type: 'uuid' })
  @Generated('uuid')
  @Exclude()
  token: string;

  @Column({ type: 'varchar', nullable: true })
  lastName: string;

  @Column({ type: 'varchar', nullable: true })
  firstName: string;

  @Column({ type: 'varchar', nullable: true })
  profileImg: string;

  @OneToMany(() => UserToSpace, (UserToSpace) => UserToSpace.User)
  UserToSpaces: UserToSpace[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    this.pw = await bcrypt.hash(this.pw, 2);
  }
}
