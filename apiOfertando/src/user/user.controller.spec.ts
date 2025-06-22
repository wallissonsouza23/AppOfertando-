import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect('This action returns all users');
  });

  it('/users (POST)', () => {
    const novoUsuario = {
      name: 'Wallisson',
      email: 'wallisson@email.com',
    };

    return request(app.getHttpServer())
      .post('/users')
      .send(novoUsuario)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('message', 'Usuário criado com sucesso');
        expect(res.body.data).toEqual(novoUsuario);
      });
  });
});
