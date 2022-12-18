import { Entity, ManyToOne, OneToOne } from 'typeorm';
import { DefaultColumns } from './common/default.columns';
import { User } from './user.entity';
import { SpaceRole } from './space-role.entity';
import { Space } from './space.entity';

@Entity('user_to_space')
export class UserToSpace extends DefaultColumns {
  @OneToOne(() => SpaceRole, (spaceRole) => spaceRole.id)
  spaceRole: SpaceRole;

  @ManyToOne(() => User, (user) => user.UserToSpaces)
  User: User;

  @ManyToOne(() => Space, (space) => space.UserToSpaces)
  Space: Space;
}
