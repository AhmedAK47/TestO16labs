import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BlogDto {
  // @ApiProperty({ example: '12', description: 'it should be pass when the time of update',  })
  // id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  createdBy: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}

export class BlogDtoForUpdate {
   
    @ApiProperty({required:false})
    title: string;
  
    @ApiProperty({required:false})
    description: string;
  
    createdBy: string;
  
    @ApiProperty({ type: 'string', format: 'binary' ,required:false})
    image: any;
  }
