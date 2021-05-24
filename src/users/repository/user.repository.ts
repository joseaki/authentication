import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  findUserData(email: string, clientId: number) {
    return this.findOne({
      where: { email: email, clientId: clientId },
    });
  }

  findDelicateUserData(email: string, clientId: number) {
    return this.findOne({
      where: { email: email, clientId: clientId },
      select: [
        'name',
        'lastname',
        'id',
        'email',
        'clientId',
        'username',
        'password',
      ],
    });
  }

  findByRestorePasswordToken(token: string, clientId: number) {
    return this.findOne({
      where: {
        isValidPasswordToken: true,
        restorePasswordToken: token,
        clientId: clientId,
      },
      select: [
        'name',
        'lastname',
        'id',
        'email',
        'clientId',
        'username',
        'restorePasswordDate',
      ],
    });
  }
}
