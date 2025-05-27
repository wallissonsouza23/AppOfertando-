import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
 
}


