import { apiHandler } from "@/app/_helpers/api/apiHandler"
import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma";
import joi from "joi";

async function GET(request: NextRequest, route: { params: { acronym: string} }) {
  const acronym = await prisma.acronym.findFirst({
    where: {
      acronym: route.params.acronym
    }
  })

  if (!acronym) {
    throw new Error(`Entity: ${route.params.acronym} not found.`)
  }

  return { data: acronym }
}

// There are mutiple items in DB with same acronym so PUT will in that case overide all of them
// so I decided to go with ID for PUT functionality instead
async function PUT(request: NextRequest, route: { params: { acronym: string } }) {
  const body = request.json();

  const existingEntity = await prisma.acronym.findFirst({ where: { id: Number(route.params.acronym) } });
  if (!existingEntity) {
    throw new Error('Entity not found');
  }

  const updatedAcronym = await prisma.acronym.update({
    where: { id: Number(route.params.acronym) },
    data: body,
  });

  return { data: updatedAcronym };
}

PUT.validationSchemes = {
  body: joi.object({
    acronym: joi.string().min(1).optional(),
    word: joi.string().min(3).optional(),
  }),
  params: joi.object({
    acronym: joi.number().positive().required()
  })
};

// There are mutiple items in DB with same acronym so PUT will in that case overide all of them
// so I decided to go with ID for PUT functionality instead
async function DELETE(request: Request, route: { params: { acronym: number } }) {
  const deletedAcronym = await prisma.acronym.delete({
    where: { id: Number(route.params.acronym) },
  })
  return { data: deletedAcronym }
}

module.exports = apiHandler({ GET, PUT, DELETE });
