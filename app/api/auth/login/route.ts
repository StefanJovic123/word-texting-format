import { apiHandler } from '@/app/_helpers/api/apiHandler';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import joi from 'joi';
import jwt from 'jsonwebtoken';

async function login(req: Request) {
  const body = await req.json();
  const user = await prisma.user.findUnique({ where: { email: body.email }})

  if (!(user && bcrypt.compareSync(body.password, user.password))) {
    throw 'Username or password is incorrect';
  }

  // create a jwt token
  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!);

  return {
    data: {
      user,
      token,
    }
  };
}

login.schema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(3).required(),
});

module.exports = apiHandler({ POST: login });
