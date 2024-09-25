import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from 'src/model/User.model';
import { DataSource, Repository } from 'typeorm';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AuthUserDto } from '../auth/register.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel) private userRepository: Repository<UserModel>,
    private readonly dataSource: DataSource,
  ) {}

  async createUser(payload: AuthUserDto): Promise<UserModel> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = this.userRepository.create(payload);
      const savedUser = await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      return savedUser;
    } catch (err) {
      console.error('error', err);
      await queryRunner.rollbackTransaction();
      if (err.code === '23505') {
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    } finally {
      await queryRunner.release();
    }
  }

  async getUserByEmailId(emailId: string): Promise<UserModel> {
    const user = await this.userRepository.findOne({
      select: ['id', 'password', 'email'],
      where: { email: emailId },
      relations: ['shopUserRoles.role', 'shopUserRoles.shop'],
    });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }
  async getUserById(id: number): Promise<UserModel> {
    const user = await this.userRepository.findOne({
      select: ['id', 'password', 'email'],
      where: { id: id },
      relations: ['shopUserRoles.role', 'shopUserRoles.shop'],
    });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  async getRoles(userId: number) {
    const user = await this.userRepository.findOne({
      select: ['id'],
      where: { id: userId },
      relations: ['shopUserRoles.role', 'shopUserRoles.shop'],
    });
    return user.shopUserRoles;
  }
}
