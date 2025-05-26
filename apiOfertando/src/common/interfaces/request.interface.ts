// src/common/interfaces/request.interface.ts (Exemplo)
import { Request } from 'express';
import { User } from '../../user/entities/user.entity'; // Certifique-se do caminho

export interface RequestWithUser extends Request {
  user: User; // Ou um tipo mais simples com apenas o 'id' e 'email' que vem do JWT
}