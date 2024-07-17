import { BaseEntity } from 'src/users/entities';
import { Column, Entity } from 'typeorm';

@Entity('products')
export class Products extends BaseEntity {
  @Column({ length: 255, nullable: true })
  product_name: string;

  @Column({ length: 255, nullable: true })
  product_description: string;

  @Column({ type: 'float', nullable: true })
  product_price: number;

  @Column({ length: 255, nullable: true })
  product_image_url: string;
}
