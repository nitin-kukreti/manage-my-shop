import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleModel } from 'src/model/Role.model';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleModel) private roleRepository: Repository<RoleModel>,
  ) {}
  async getRoleByName(name: string) {
    const role = await this.roleRepository.findOne({
      where: {
        name: name,
      },
    });
    return role;
  }
  async getRoleById(id: number) {
    const role = await this.roleRepository.findOne({
      where: {
        id: id,
      },
    });
    return role;
  }
}
