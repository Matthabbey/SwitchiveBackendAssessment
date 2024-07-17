import { Entity, BeforeInsert, Column } from 'typeorm';
import { BaseEntity } from './baseentity.entity';

@Entity('users')
export class Users extends BaseEntity {
  @BeforeInsert()
  toLowerCase() {
    this.email = this.email?.toLowerCase();
  }

  @Column({ length: 255, nullable: true })
  first_name: string;

  @Column({ length: 255, nullable: true })
  last_name: string;

  @Column({ length: 255, unique: true, nullable: true })
  email: string;

  @Column({ length: 255, unique: true, nullable: true })
  password: string;

  @Column({ length: 255, unique: true, nullable: true })
  user_otp: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  is_email_verified: boolean;
}
