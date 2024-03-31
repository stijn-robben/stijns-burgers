import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    // Log the user's role
    if (user) {
        this.logger.log(`User ${user.username} with id ${user.sub} with role ${user.role} is trying to access a restricted route.`);
      } else {
        this.logger.log(`Anonymous user is trying to access a restricted route.`);
      }
    // Check if the user's role matches any of the required roles
    const hasRole = requiredRoles.some((role) => user?.role?.includes(role));
    if (!hasRole) {
      this.logger.warn(`User ${user._id} with role ${user.role} is not authorized to access this route.`);
    }
    return hasRole;
  }
}