import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { DefaultColumns } from './common/default.columns';
import { Post } from './post.entity';

@Entity({ name: 'chat' })
export class Chat extends DefaultColumns {
  @Column({ type: 'varchar' })
  content: string;

  @Column({ type: 'boolean' })
  anonymous: boolean;

  @ManyToOne(() => Post, (post) => post.Chats)
  Post: Post;

  @ManyToOne(() => Chat, (chat) => chat.childChat)
  ParentChat: Chat;

  @OneToMany(() => Chat, (chat) => chat.ParentChat)
  childChat: Chat[];
}
