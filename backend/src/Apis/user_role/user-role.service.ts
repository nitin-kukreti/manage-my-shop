import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShopUserRoleModel } from 'src/model/UserRole.model';
import { ILike, IsNull, Not, QueryRunner, Repository } from 'typeorm';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(ShopUserRoleModel)
    private readonly userRoleRepository: Repository<ShopUserRoleModel>,
  ) {}

  async addShopPermission(
    shopId: number,
    userId: number,
    roleId: number,
    queryRunner?: QueryRunner,
  ) {
    const manager = queryRunner
      ? queryRunner.manager
      : this.userRoleRepository.manager;

    const shopPermission = manager.create(ShopUserRoleModel, {
      role: { id: roleId },
      shop: { id: shopId },
      user: { id: userId },
    });

    try {
      await manager.save(shopPermission);
      return { success: true, message: 'Permission added successfully.' };
    } catch (error) {
      throw new Error('Failed to add shop permission');
    }
  }

  async removeShopPermissionById(id: number, queryRunner?: QueryRunner) {
    const manager = queryRunner
      ? queryRunner.manager
      : this.userRoleRepository.manager;

    try {
      await manager.delete(ShopUserRoleModel, { id: id });
      return { success: true, message: 'Permission removed successfully.' };
    } catch (error) {
      throw new Error('Failed to remove shop permission');
    }
  }

  async getRoleShopIdUserId(shopId: number, userId: number) {
    const result = await this.userRoleRepository.find({
      relations: ['role'],
      where: {
        shop: {
          id: shopId,
        },
        user: {
          id: userId,
        },
      },
    });
    return result.map(({ role }) => role);
  }

  async getShopByUserId(userId: number, name?: string) {
    let result: ShopUserRoleModel[];
    if (!name) {
      result = await this.userRoleRepository.find({
        relations: ['shop'],
        where: {
          user: {
            id: userId,
          },
          shop: {
            id: Not(IsNull()),
          },
        },
      });
    } else {
      result = await this.userRoleRepository.find({
        relations: ['shop'],
        where: {
          user: {
            id: userId,
          },
          shop: {
            id: Not(IsNull()),
            name: ILike(`%${name}%`),
          },
        },
      });
    }
    return result.map((item) => item.shop);
  }

  async deleteShopRole(shopId: number, roleId: number, userId: number) {
    const { affected } = await this.userRoleRepository.softDelete({
      shop: {
        id: shopId,
      },
      role: {
        id: roleId,
      },
      user: {
        id: userId,
      },
    });
    if (affected === 0) throw new NotFoundException('Role Not Found');
  }

  async addUserRole(shopId: number, staffId: number, roleId) {
    try {
      const userRole = this.userRoleRepository.create({
        shop: {
          id: shopId,
        },
        role: {
          id: roleId,
        },
        user: {
          id: staffId,
        },
      });
      return await this.userRoleRepository.save(userRole);
    } catch (error) {
      console.log(error);
      if (error.code === 23505) {
        throw new ConflictException('already exists');
      }
    }
  }
}
