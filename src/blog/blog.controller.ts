import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from './file.upload';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { AdminRoleGuard } from '../auth/guard/role.guard';
import { Roles } from '../decorator/role.decorator';
import { BlogDto, BlogDtoForUpdate } from '../dto/blog.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { GetUser } from 'src/decorator/user.decorator';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @Post()
  @ApiOperation({
    summary: 'this endpoint use to create Blogs',
  })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ description: 'return Blogs object' })
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminRoleGuard)
  @ApiBearerAuth('jwt')
  @Roles('admin')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async createBlogs(
    @UploadedFile() file,
    @Body() body: BlogDto,
    @GetUser() user,
  ) {
    body.createdBy = user.username;
    return await this.blogService.createBlogs(body, file);
  }

  @Put()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'this endpoint use to update Blogs',
  })
  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminRoleGuard)
  @ApiBearerAuth('jwt')
  @Roles('admin')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async updateUser(
    @UploadedFile() file,
    @Body() body: BlogDtoForUpdate,
    @GetUser() user
  ) {
    return await this.blogService.updateBlogs(body, user, file);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminRoleGuard)
  @Roles('admin')
  @ApiBearerAuth('jwt')
  @Delete(':id')
  async deleteBlogs(@Param('id') id: number) {
    return await this.blogService.deleteBlogs(id);
  }

  @Get('froUser')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  async getListForUser(@GetUser() user) {
    return await this.blogService.getListForUser(user.username);
  }

  @Get('getAll')
  async getAll() {
    return await this.blogService.getAll();
  }
}
