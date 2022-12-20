import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { SpaceRole } from './space-role.entity';
import { User } from './user.entity';
import { Post } from './post.entity';
import { DefaultColumns } from './common/default.columns';
import { UserToSpace } from './user-to-space.entity';

@Entity({ name: 'space' })
export class Space extends DefaultColumns {
  @Column({ type: 'varchar' })
  name: string;
  @Column({ type: 'varchar', nullable: true })
  logoImg: string;
  @Column({ type: 'varchar' })
  adminCode: string;
  @Column({ type: 'varchar' })
  participantCode: string;
  @ManyToOne(() => User, (user) => user.id)
  creator: User;
  @OneToMany(() => UserToSpace, (userToSpace) => userToSpace.Space, {
    cascade: ['insert', 'update', 'soft-remove'],
  })
  UserToSpaces: UserToSpace[];
  @OneToMany(() => SpaceRole, (spaceRole) => spaceRole.Space, {
    cascade: ['insert', 'update', 'soft-remove'],
  })
  SpaceRoles: SpaceRole[];
  @OneToMany(() => Post, (post) => post.Space, {
    cascade: ['insert', 'update', 'soft-remove'],
  })
  Posts: Post[];
}
