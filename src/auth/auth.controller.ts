import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  Request,
  Headers,
  Res,
  Response,
  Get,
  Req,
} from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConvertResponseToDtoInterceptor } from 'src/Interceptors/convert-response-to-dto.interceptor';
import { ValidateBodyPipe } from 'src/Pipes/validate-body.pipe';
import { RegisterUserDto } from 'src/auth/dto/in/register-user.dto';
import { CreateUserOutDto } from 'src/auth/dto/out/user-registered-out.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginUserDto } from './dto/in/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserPasswordRecovery } from './dto/in/password_recovery.dto';
import { HeaderDTO } from './dto/in/header.dto';
import { RequestHeader } from './decorators/request-header.decorator';
import { IHeader } from 'src/common/interfaces/IHeaders';
import { HeadersAuthGuard } from './guards/headers.guard';

@ApiTags('User oeprations')
@ApiHeader({
  name: 'client-id',
  description: 'App Id that user belongs to',
  allowEmptyValue: false,
  required: true,
  schema: {
    default: 1,
  },
})
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  // REGISTER USER
  @Post('register')
  @ApiResponse({
    status: 201,
    type: CreateUserOutDto,
    description: 'User response after creation',
  })
  @UseInterceptors(new ConvertResponseToDtoInterceptor(CreateUserOutDto))
  create(
    @RequestHeader(HeaderDTO) headers: IHeader,
    @Body(new ValidateBodyPipe()) createUserDto: RegisterUserDto,
  ) {
    return this.authService.register(createUserDto, headers);
  }

  // LOGIN USER
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @UseGuards(HeadersAuthGuard)
  async login(
    @RequestHeader(HeaderDTO) headers: IHeader,
    @Body(new ValidateBodyPipe()) loginUserDto: LoginUserDto,
    @Request() req,
    @Res({ passthrough: true }) response,
  ) {
    const credentials = await this.authService.login(req.user);
    response.cookie('ART', credentials.refresh_token, {
      expires: new Date(new Date().getTime() + 60 * 60 * 1000),
      sameSite: 'lax',
      httpOnly: true,
    });
    return this.authService.login(req.user);
  }

  // RESTORE USER PASSWORD
  @Post('change_password')
  changePassword(
    @Headers('client-id') clientId: string,
    @Body(new ValidateBodyPipe()) restoreUserPassword: UserPasswordRecovery,
  ) {
    return restoreUserPassword;
  }

  @Get('user')
  getUser(@Req() request, @Res({ passthrough: true }) response) {
    console.log(process.env.NODE_ENV);
    response.cookie('ARTdsd', 'asdfa', {
      expires: new Date(new Date().getTime() + 60 * 60 * 1000),
      sameSite: 'None',
      httpOnly: true,
      secure: process.env.NODE_ENV ? false : true,
      path: '/auth/usersave',
    });
    console.log(request.cookies);
    return { hola: 'mundo' };
  }

  @Post('usersave')
  saveUser(@Req() request) {
    console.log(request.cookies);
    return { hola: 'save user' };
  }
}
