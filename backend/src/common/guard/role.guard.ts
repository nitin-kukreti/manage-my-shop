import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/role.decorator';
import { AuthUserInfoInterface } from 'src/Apis/auth/auth.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the required roles for this route from the metadata
    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || [];

    if (requiredRoles.length === 0) return true;

    // Get the user from the request (assuming you're storing user data in request object)
    const { user, params } = context.switchToHttp().getRequest();
    console.log({ params, user });

    // Check if the user has any of the required roles
    return requiredRoles.some((_role) => {
      for (const { role, shop } of (user as AuthUserInfoInterface).roles) {
        if (role === _role && shop == params.shopId) return true;
        if (role === 'super_admin') return true;
      }
      return false;
    });
  }
}
