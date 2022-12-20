import { Column, Entity, ManyToOne } from 'typeorm';
import { Space } from './space.entity';
import { DefaultColumns } from './common/default.columns';

export enum RoleSet {
  ADMIN = 'admin',
  PARTICIPANT = 'participant',
}

@Entity({ name: 'space_role' })
export class SpaceRole extends DefaultColumns {
  @Column({ type: 'varchar' })
  roleName: string;

  @Column({ type: 'enum', enum: RoleSet })
  roleSet: string;

  @ManyToOne(() => Space, (space) => space.SpaceRoles)
  Space: Space;
}
