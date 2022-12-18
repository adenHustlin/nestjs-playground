import { Column, Entity, OneToMany } from 'typeorm';
import { DefaultColumns } from './common/default.columns';
import { UserToSpace } from './user-to-space.entity';

@Entity({ name: 'user' })
export class User extends DefaultColumns {
  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  profileImg: string;

  @OneToMany(() => UserToSpace, (UserToSpace) => UserToSpace.User)
  UserToSpaces: UserToSpace[];
}
