import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  findUserData(email: string, clientId: number) {
    return this.findOneOrFail({
      where: { email: email, clientId: clientId },
    });
  }

  findDelicateUserData(email: string, clientId: number) {
    return this.findOneOrFail({
      where: { email: email, clientId: clientId },
    });
  }

  findByRestorePasswordToken(token: string, clientId: number) {
    return this.findOneOrFail({
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
