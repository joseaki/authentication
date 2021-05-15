import { Expose } from 'class-transformer';
import { IsDefined, IsString } from 'class-validator';
import { IHeader } from 'src/interfaces/IHeaders';

export class HeaderDTO implements IHeader {
  @IsString()
  @IsDefined()
  @Expose({ name: 'client-id' }) // required as headers are case insensitive
  'client-id': string;
}
