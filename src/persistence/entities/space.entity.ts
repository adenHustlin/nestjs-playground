import {
  BeforeInsert,
  Column,
  Entity,
  Generated,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { SpaceRole } from './space-role.entity';
import { User } from './user.entity';
import { Post } from './post.entity';
import { DefaultColumns } from './common/default.columns';
import { UserToSpace } from './user-to-space.entity';
import { uuid } from '../../common/function/common.functions';

@Entity({ name: 'space' })
export class Space extends DefaultColumns {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  logoImg: string;

  @Column({ type: 'varchar' })
  @Generated('uuid')
  adminCode: string;

  @Column({ type: 'varchar' })
  participantCode: string;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  creator: User;

  @OneToMany(() => UserToSpace, (userToSpace) => userToSpace.Space)
  UserToSpaces: UserToSpace[];

  @OneToMany(() => SpaceRole, (spaceRole) => spaceRole.Space)
  SpaceRoles: SpaceRole[];

  @OneToMany(() => Post, (post) => post.Space)
  Posts: Post[];

  @BeforeInsert()
  async setCodes() {
    if (!this.adminCode && !this.participantCode) {
      this.adminCode = uuid(8);
      this.participantCode = uuid(8);
    }
  }
}
