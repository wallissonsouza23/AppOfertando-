import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UseGuards, Req } from '@nestjs/common';
import { FirebaseAuthGuard } from './common/guards/firebase-auth.guard';
import { Request } from 'express';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @UseGuards(FirebaseAuthGuard)
@Get('protegido')
getProtegido(@Req() req: Request) {
  return {
    mensagem: 'Você está autenticado!',
    usuario: req['user'], // Dados do Firebase
  };
}

}
