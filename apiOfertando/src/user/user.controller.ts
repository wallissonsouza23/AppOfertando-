// src/user/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs'; // Importe fs para manipular arquivos

// Importações do seu projeto (VERIFIQUE OS CAMINHOS RELATIVOS!)
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RequestWithUser } from '../common/interfaces/request.interface'; // VERIFIQUE ESTE CAMINHO
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // VERIFIQUE ESTE CAMINHO

// Para o tipo do Multer (se não estiver definido globalmente)
declare namespace Express {
  namespace Multer {
    interface File {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      destination: string;
      filename: string;
      path: string;
      buffer: Buffer;
    }
  }
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    // Remover a senha antes de retornar para o frontend por segurança
    const { senha, ...result } = user;
    return result;
  }

  @Post('upload-avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/avatars', // A pasta será criada em main.ts
        filename: (req, file, cb) => {
          const uniqueName = `${(req as RequestWithUser).user.id}-${Date.now()}${extname(file.originalname)}`;
          // Usar o ID do usuário + timestamp garante unicidade e facilita a identificação
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowed.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new HttpException('Tipo de imagem inválido. Somente JPG, PNG, WEBP.', HttpStatus.BAD_REQUEST),
            false,
          );
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: RequestWithUser) {
    if (!file) {
      throw new HttpException('Nenhum arquivo de imagem enviado.', HttpStatus.BAD_REQUEST);
    }

    const userId = req.user.id; // ID do usuário logado via JWT
    const newAvatarUrl = `/uploads/avatars/${file.filename}`; // Caminho relativo

    console.log(`Backend: Usuário ${userId} tentando fazer upload. Novo path: ${newAvatarUrl}`);

    try {
      // 1. Obter o usuário atual para ver o avatar antigo
      const currentUser = await this.userService.findById(userId);

      // 2. Se existe um avatar antigo, excluí-lo do sistema de arquivos
      if (currentUser.avatarUrl && currentUser.avatarUrl.startsWith('/uploads/avatars/')) {
        const oldFilename = currentUser.avatarUrl.split('/').pop();
        const oldFilePath = `./uploads/avatars/${oldFilename}`;
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath); // Excluir o arquivo antigo
          console.log(`Backend: Avatar antigo (${oldFilePath}) excluído para o usuário ${userId}`);
        }
      }

      // 3. Atualizar o avatar no banco de dados com a nova URL
      const updatedUser = await this.userService.updateAvatar(userId, newAvatarUrl);

      console.log(`Backend: Avatar atualizado para usuário ${userId}. Dados retornados:`, updatedUser);

      // Retorne apenas os dados necessários (sem a senha)
      const { senha, ...result } = updatedUser;
      return {
        message: 'Avatar enviado e atualizado com sucesso!',
        avatarUrl: result.avatarUrl, // Retorne a URL que foi salva no DB
      };
    } catch (error) {
      console.error('Erro no processamento do upload de avatar:', error);
      // Se houver um erro, é bom tentar remover o arquivo recém-carregado para evitar lixo
      const uploadedFilePath = `./uploads/avatars/${file.filename}`;
      if (fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }
      throw new HttpException('Falha ao atualizar avatar.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return users.map(user => {
      const { senha, ...result } = user;
      return result;
    });
  }


  @Get('me') // NOVO ENDPOINT: Para o frontend buscar o perfil completo do usuário logado
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@Req() req: RequestWithUser) {
    const user = await this.userService.findById(req.user.id);
    const { senha, ...result } = user; // Remover a senha
    return result;
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    const { senha, ...result } = user; // Remover a senha
    return result;
  }

  @Get(':id/liked-comments')
  @UseGuards(JwtAuthGuard)
  async getLikedComments(@Param('id') id: string, @Req() req: RequestWithUser) {
    if (req.user.id !== id) {
      throw new HttpException('Sem permissão para acessar os likes de outro usuário.', HttpStatus.FORBIDDEN);
    }
    return this.userService.getLikedCommentIds(id);
  }


  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req: RequestWithUser) {
    if (req.user.id !== id) {
      throw new HttpException('Você não tem permissão para atualizar este perfil.', HttpStatus.FORBIDDEN);
    }
    const updatedUser = await this.userService.update(id, updateUserDto);
    const { senha, ...result } = updatedUser; // Remover a senha
    return result;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    if (req.user.id !== id) {
      throw new HttpException('Você não tem permissão para excluir esta conta.', HttpStatus.FORBIDDEN);
    }
    // Opcional: Se o usuário tiver um avatar, você pode excluí-lo do sistema de arquivos aqui também.
    const userToDelete = await this.userService.findById(id);
    if (userToDelete.avatarUrl && userToDelete.avatarUrl.startsWith('/uploads/avatars/')) {
      const filename = userToDelete.avatarUrl.split('/').pop();
      const filePath = `./uploads/avatars/${filename}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Backend: Avatar (${filePath}) excluído ao remover usuário ${id}`);
      }
    }
    await this.userService.remove(id);
    return { message: 'Usuário e dados associados removidos com sucesso.' };
  }
}