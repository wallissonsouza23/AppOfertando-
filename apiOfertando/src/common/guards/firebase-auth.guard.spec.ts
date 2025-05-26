// src/common/guards/firebase-auth.guard.ts

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as admin from 'firebase-admin';

// Verifique se o Firebase já foi inicializado antes de inicializar novamente
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // Ou forneça o caminho para o arquivo de credenciais
  });
} else {
  admin.app(); // Se já tiver uma instância, usa a instância existente
}

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token não fornecido');
    }

    const token = authorization.split(' ')[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      request['user'] = decodedToken; // Adiciona os dados do usuário na requisição
      return true;
    } catch (error) {
      console.error('Erro ao verificar token Firebase:', error);
      throw new UnauthorizedException('Token inválido');
    }
  }
}
