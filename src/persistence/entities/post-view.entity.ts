import {
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { UserToSpace } from './user-to-space.entity';

// 1번 ,2번 유저 존재
// 1번유저만 읽고 글에 새로운댓글달림
// 1번유저한텐 새로운 댓글달림 표시 , 2번유저한텐 새로운글 표시
// 유저마다 글의 상태값이 다름
// 유저마다 글을 읽은시간 기록한다
// 읽은시간은 읽을때마다 업데이트 시켜준다
// switch (읽은시간)
// case 없음 : return 새글입니다
// case 읽은시간이 업데이트시간보다 전임 : return 업데이트된 글입니다
// case 글의 가장최근 댓글이 읽은시간 이후에 달림 : return 댓글새거있습니다.

@Entity({ name: 'post_view' })
@Index(['UserToSpace', 'Post'], { unique: true })
export class PostView {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @UpdateDateColumn()
  readTime: Date;

  @ManyToOne(() => UserToSpace, (userToSpace) => userToSpace.id)
  UserToSpace: UserToSpace;

  @ManyToOne(() => Post, (post) => post.id)
  Post: Post;
}
