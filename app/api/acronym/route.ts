import { apiHandler } from "@/app/_helpers/api/apiHandler";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import joi from 'joi';

async function GET(request: NextRequest) {
  const queryParams = request.nextUrl.searchParams;

  const from = Number(queryParams.get("from")) || 0;
  const limit = Number(queryParams.get("limit")) || 10;
  const searchQ = queryParams.get("search");

  const where = searchQ && searchQ.length ? {
    acronym: {
      contains: searchQ,
      mode: "insensitive",
    },
  } : {};

  let [result, count] = await prisma.$transaction([
    prisma.acronym.findMany({
      skip: from,
      take: limit,
      where: where,
    }),
    prisma.acronym.count({
      skip: from,
      where: where,
    }),
  ]);

  return {
    data: result,
    ops: {
      headers: {
        "x-has-more": count > 0,
      },
    },
  };
}

GET.validationSchemes = {
  query: joi.object({
    from: joi.number().optional(),
    limit: joi.number().optional(),
    search: joi.string().min(1).optional(),
  })
};

async function POST(request: NextRequest) {
  const body = request.json();
  const acronym = await prisma.acronym.create({
    data: {
      acronym: body.acronym,
      word: body.word,
    }
  });

  return { data: acronym };
}

POST.validationSchemes = {
  body: joi.object({
    acronym: joi.string().min(1).required(),
    word: joi.string().min(3).required(),
  })
}

module.exports = apiHandler({
  POST,
  GET,
});
