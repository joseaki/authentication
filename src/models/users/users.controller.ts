import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';

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
