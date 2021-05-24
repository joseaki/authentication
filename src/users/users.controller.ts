import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/in/register-user.dto';
import { UpdateUserDto } from './dto/in/update-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConvertResponseToDtoInterceptor } from 'src/Interceptors/convert-response-to-dto.interceptor';
import { ValidateBodyPipe } from 'src/Pipes/validate-body.pipe';
import { CreateUserOutDto } from './dto/out/user-registered-out.dto';

@ApiTags('Users')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Patch(':id')
  // @ApiResponse({
  //   status: 200,
  //   description: 'Patch any parameter from user object',
  // })
  // update(
  //   @Param('id') id: string,
  //   @Body(new ValidateBodyPipe())
  //   updateUserDto: UpdateUserDto,
  // ) {
  //   return this.usersService.update(+id, updateUserDto);
  // }
}
