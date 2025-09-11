import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/common/enums/role.enum'; // Asegúrate de que esta ruta sea correcta

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtiene los roles requeridos desde los metadatos de la ruta, usando el decorador @Roles().
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si la ruta no tiene un decorador @Roles(), permite el acceso por defecto.
    if (!requiredRoles) {
      return true;
    }

    // Obtiene el objeto de usuario que fue adjuntado a la petición por el AuthGuard('jwt').
    const { user } = context.switchToHttp().getRequest();

    // Comprueba si el rol del usuario está incluido en la lista de roles requeridos.
    // Si el usuario tiene el rol necesario, el guard devuelve 'true' y permite el acceso.
    return requiredRoles.some((role) => user.role === role);
  }
}
