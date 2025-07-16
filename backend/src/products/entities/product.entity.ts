import { Product } from '@shared/interfaces/product.interface';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('products')
export class ProductEntity implements Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  article: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;
}
