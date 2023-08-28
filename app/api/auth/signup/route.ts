import { apiHandler } from '@/app/_helpers/api/apiHandler';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import joi from 'joi';

async function signup(req: Request) {
  const body = await req.json();

  // validate
  const existingUser = await prisma.user.findUnique({ where: { email: body.email } })
  if (existingUser) {
    throw `Email ${body.email} is already taken`;
  }

  const user = await prisma.user.create({
    data: {
      email: body.email,
      password: bcrypt.hashSync(body.password, 10)
    }
  });
  
  return { data: user };
}

signup.validationSchemes = {
  body: joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(3).required(),
  })
};

module.exports = apiHandler({ POST: signup });
