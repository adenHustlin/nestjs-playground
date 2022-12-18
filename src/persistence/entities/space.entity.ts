import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { SpaceRole } from './space-role.entity';
import { User } from './user.entity';
import { Post } from './post.entity';
import { DefaultColumns } from './common/default.columns';
import { UserToSpace } from './user-to-space.entity';

@Entity({ name: 'space' })
export class Space extends DefaultColumns {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  logoImg: string;

  @Column({ type: 'varchar' })
  adminCode: string;

  @Column({ type: 'varchar' })
  participantCode: string;

  @OneToOne(() => User, (user) => user.id)
  creator: User;

  @OneToMany(() => UserToSpace, (userToSpace) => userToSpace.Space)
  UserToSpaces: UserToSpace[];

  @OneToMany(() => SpaceRole, (spaceRole) => spaceRole.Space)
  SpaceRoles: SpaceRole[];

  @OneToMany(() => Post, (post) => post.Space)
  Posts: Post[];
}
