import { Column, Entity, ManyToOne } from 'typeorm';
import { DefaultColumns } from './common/default.columns';
import { Post } from './post.entity';

@Entity({ name: 'post_file' })
export class PostFile extends DefaultColumns {
  @Column({ type: 'varchar' })
  path: string;

  @Column({ type: 'varchar' })
  extension: string;

  @ManyToOne(() => Post, (post) => post.Files)
  Post: Post;
}
