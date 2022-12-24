import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultColumns } from './common/default.columns';
import { Post } from './post.entity';
import { UserToSpace } from './user-to-space.entity';

@Entity({ name: 'chat' })
export class Chat extends DefaultColumns {
  @Column({ type: 'varchar' })
  content: string;

  @Column({ type: 'boolean' })
  anonymous: boolean;

  @ManyToOne(() => Post, (post) => post.Chats)
  Post: Post;

  @ManyToOne(() => Chat, (chat) => chat.id)
  @JoinColumn()
  ParentChat: Chat;

  @ManyToOne(() => UserToSpace, (userToSpace) => userToSpace.id)
  UserToSpace: UserToSpace;
}
