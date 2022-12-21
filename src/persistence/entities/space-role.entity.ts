import { Column, Entity, ManyToOne } from 'typeorm';
import { Space } from './space.entity';
import { DefaultColumns } from './common/default.columns';
import { SpaceRoleSet } from '../../common/constatns';

@Entity({ name: 'space_role' })
export class SpaceRole extends DefaultColumns {
  @Column({ type: 'varchar' })
  roleName: string;

  @Column({ type: 'enum', enum: SpaceRoleSet })
  roleSet: SpaceRoleSet;

  @ManyToOne(() => Space, (space) => space.SpaceRoles)
  Space: Space;
}
