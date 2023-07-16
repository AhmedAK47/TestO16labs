import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from '../entity/blog.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { User } from 'src/entity/user.entity';

@Injectable()
export class BlogService {
  constructor(
    private userService: UserService,
    @InjectRepository(Blog)
    private readonly blogRepo: Repository<Blog>,
  ) {}

  async createBlogs(body, file) {
    const user = await this.userService.findUser(body.createdBy);
    const [checkUserAlreadyHaveBlogs] = await this.blogRepo.find({
      where: { createdBy: user },
    });
    if (checkUserAlreadyHaveBlogs)
      throw new HttpException(
        'You can add only one Blog',
        HttpStatus.BAD_REQUEST,
      );
    const blogs = new Blog();
    blogs.createdBy = user;
    blogs.description = body.description;
    blogs.title = body.title;
    blogs.image = 'localhost:3000/' + file.filename;
    return await this.blogRepo.save(blogs);
  }

  async updateBlogs(body,user,file){
    const userObj = new User();
    userObj.username = user.username;
    const [check] = await this.blogRepo.find({where:{
      createdBy:userObj
    }})
    if(!check) throw new HttpException(
      'First create a blog',
      HttpStatus.BAD_REQUEST,
    );
    body.id = check.id;
    if (file) body.image = 'localhost:3000/' + file.filename;
    for (let key in body) {
      if (body[key] === null || body[key] === '') {
        delete body[key];
      }
    }
    const data = await this.blogRepo.save(body);
    if(!!data.id){
     return {
      updated:1,
      message:'updated succesfully'
     }
    }
  }

  async deleteBlogs(id) {
    const response = await this.blogRepo.delete(id);
    if (response?.affected === 1) {
      return {
        deleted: 1,
        message: 'deleted Succesfully',
      };
    } else {
      return {
        deleted: 0,
        message: 'not found',
      };
    }
  }
  async getListForUser(username) {
    const user = new User();
    user.username = username;
    return await this.blogRepo.find({
      where: {
        createdBy: user,
      },
    });
  }

  async getAll(){
   return await this.blogRepo.find({relations:['createdBy']});
  }
}
