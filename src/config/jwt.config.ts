import * as path from 'path';
import * as dotenv from 'dotenv';

const dotenv_path = path.resolve(process.cwd(), `.env`);
const result = dotenv.config({ path: dotenv_path });
if (result.error) {
  /* do nothing */
}

export const JWT = {
  jwtSecret: process.env.JWT_SECRET || 'none',
};

export default JWT;
