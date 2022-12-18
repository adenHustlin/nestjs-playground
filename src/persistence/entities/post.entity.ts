import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { DefaultColumns } from './common/default.columns';
import { PostFile } from './post-file.entity';
import { Space } from './space.entity';
import { Chat } from './chat.entity';

export enum PostType {
  NOTICE = 'notice',
  QUESTION = 'question',
}

// 1번 ,2번 유저 존재
// 1번유저만 읽고 글에 새로운댓글달림
// 1번유저한텐 새로운 댓글달림 표시 , 2번유저한텐 새로운글 표시
// 유저마다 글의 상태값이 다름
@Entity({ name: 'post' })
export class Post extends DefaultColumns {
  @Column({ type: 'enum', enum: PostType })
  postType: PostType;

  @Column({ type: 'varchar' })
  content: string;

  @Column({ type: 'boolean' })
  anonymous: boolean;

  @OneToMany(() => PostFile, (postFile) => postFile.Post)
  Files: PostFile[];

  @OneToMany(() => Chat, (chat) => chat.Post)
  Chats: Chat[];

  @ManyToOne(() => Space, (space) => space.Posts)
  Space: Space;
}
