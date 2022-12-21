import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { DefaultColumns } from './common/default.columns';
import { User } from './user.entity';
import { SpaceRole } from './space-role.entity';
import { Space } from './space.entity';
import { SpaceRoleSet } from '../../common/constatns';

@Entity('user_to_space')
@Index(['User', 'Space'], { unique: true })
export class UserToSpace extends DefaultColumns {
  @Column({ type: 'enum', enum: SpaceRoleSet })
  roleSet: SpaceRoleSet;

  @ManyToOne(() => SpaceRole, (spaceRole) => spaceRole.id, {
    cascade: ['insert'],
  })
  SpaceRole: SpaceRole;

  @ManyToOne(() => User, (user) => user.UserToSpaces)
  User: User;

  @ManyToOne(() => Space, (space) => space.UserToSpaces)
  Space: Space;
}
