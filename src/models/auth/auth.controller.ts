import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UseInterceptors, Request, Res } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';

// Services
import { AuthService } from './auth.service';
// Decorators
import { HeadersAuthGuard } from './guards/headers.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RequestHeader } from './decorators/request-header.decorator';
import { ValidateBodyPipe } from 'common/Pipes/validate-body.pipe';
import { ConvertResponseToDtoInterceptor } from 'common/Interceptors/convert-response-to-dto.interceptor';
// DTO IN
import { RegisterUserDto } from 'models/auth/dto/in/register-user.dto';
import { LoginUserDto } from './dto/in/login-user.dto';
import { UserPasswordRecovery } from './dto/in/password_recovery.dto';
import { UserPasswordUpdate } from './dto/in/password_recovery.dto';
import { HeaderDTO } from './dto/in/header.dto';
// DTO OUT
import { CreateUserOutDto } from 'models/auth/dto/out/user-registered-out.dto';
import { UserLoginOutDto } from './dto/out/user-login-out.dto';
import { UserUpdatePasswordDto } from './dto/out/user-update-password.dto';
// Types
import { IHeader } from 'interfaces/IHeaders';

@ApiTags('User oeprations')
@ApiHeader({
  name: 'client-id',
  description: 'App Id that user belongs to',
  required: true,
  schema: {
    default: '1',
  },
})
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private jwtService: JwtService) {}

  // REGISTER USER
  @Post('register')
  @ApiResponse({ status: 201, type: CreateUserOutDto, description: 'User response after creation' })
  @ApiOperation({ summary: 'Register a new user', description: 'This endpoint is used for create a new user in the app.' })
  @UseInterceptors(new ConvertResponseToDtoInterceptor(CreateUserOutDto))
  create(@RequestHeader(HeaderDTO) headers: IHeader, @Body(new ValidateBodyPipe()) createUserDto: RegisterUserDto) {
    return this.authService.register(createUserDto, +headers['client-id']);
  }

  // LOGIN USER
  @Post('login')
  @ApiResponse({ status: 201, type: UserLoginOutDto, description: 'User response after creation' })
  @ApiOperation({ summary: 'Login with user credentials', description: 'This endpoint is used for a user to login.' })
  @UseGuards(LocalAuthGuard)
  @UseGuards(HeadersAuthGuard)
  @UseInterceptors(new ConvertResponseToDtoInterceptor(UserLoginOutDto))
  async login(@RequestHeader(HeaderDTO) headers: IHeader, @Body(new ValidateBodyPipe()) loginUserDto: LoginUserDto, @Request() req, @Res({ passthrough: true }) response) {
    const credentials = await this.authService.login(req.user);
    // response.cookie('ART', credentials.refresh_token, {
    //   expires: new Date(new Date().getTime() + 60 * 60 * 1000),
    //   sameSite: 'lax',
    //   httpOnly: true,
    // });
    return credentials;
  }

  // RESTORE USER PASSWORD
  @Post('change_password')
  changePassword(@RequestHeader(HeaderDTO) headers: IHeader, @Body(new ValidateBodyPipe()) restoreUserPassword: UserPasswordRecovery) {
    return this.authService.restorePassword(restoreUserPassword, +headers['client-id']);
  }

  @Post('update_password')
  @ApiResponse({ status: 201, type: UserUpdatePasswordDto, description: 'Response after updating user password' })
  @UseInterceptors(new ConvertResponseToDtoInterceptor(UserUpdatePasswordDto))
  updatePassword(@RequestHeader(HeaderDTO) headers: IHeader, @Body(new ValidateBodyPipe()) updateUserPassword: UserPasswordUpdate) {
    return this.authService.updatePassword(updateUserPassword, +headers['client-id']);
  }

  // DEMO COOKIES
  // @Get('user')
  // getUser(@Req() request, @Res({ passthrough: true }) response) {
  //   const isProduction = process.env.NODE_ENV === 'production';
  //   response.cookie('ARTdsd', 'asdfa', {
  //     expires: new Date(new Date().getTime() + 60 * 60 * 1000),
  //     sameSite: 'None',
  //     httpOnly: true,
  //     secure: isProduction ? true : false,
  //     path: '/auth/usersave',
  //   });
  //   return { hola: 'mundo' };
  // }

  // @Post('usersave')
  // saveUser(@Req() request) {
  //   console.log(request.cookies);
  //   return { hola: 'save user' };
  // }
}
