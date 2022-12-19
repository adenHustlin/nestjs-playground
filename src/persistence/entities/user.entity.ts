import { Column, Entity, OneToMany } from 'typeorm';
import { DefaultColumns } from './common/default.columns';
import { UserToSpace } from './user-to-space.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'user' })
export class User extends DefaultColumns {
  @Column({ type: 'varchar', unique: true })
  @Exclude()
  email: string;

  @Column({ type: 'varchar' })
  @Exclude()
  pw: string;

  @Column({ type: 'varchar', nullable: true })
  lastName: string;

  @Column({ type: 'varchar', nullable: true })
  firstName: string;

  @Column({ type: 'varchar', nullable: true })
  profileImg: string;

  @OneToMany(() => UserToSpace, (UserToSpace) => UserToSpace.User)
  UserToSpaces: UserToSpace[];
}
