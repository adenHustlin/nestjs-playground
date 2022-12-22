import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { DefaultColumns } from './common/default.columns';
import { PostFile } from './post-file.entity';
import { Space } from './space.entity';
import { Chat } from './chat.entity';
import { PostType } from '../../common/constatns';
import { UserToSpace } from './user-to-space.entity';

@Entity({ name: 'post' })
export class Post extends DefaultColumns {
  @Column({ type: 'enum', enum: PostType })
  postType: PostType;

  @Column({ type: 'varchar' })
  content: string;

  @Column({ type: 'boolean' })
  anonymous: boolean;

  @OneToMany(() => PostFile, (postFile) => postFile.Post, {
    cascade: ['insert', 'update', 'soft-remove'],
  })
  Files: PostFile[];

  @OneToMany(() => Chat, (chat) => chat.Post)
  Chats: Chat[];

  @ManyToOne(() => Space, (space) => space.Posts)
  Space: Space;

  @ManyToOne(() => UserToSpace, (userToSpace) => userToSpace.id)
  UserToSpace: UserToSpace;
}
