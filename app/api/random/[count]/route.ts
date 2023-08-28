import { apiHandler } from "@/app/_helpers/api/apiHandler";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import Joi from "joi";

function generateNonAdjencantRandomIds(min: number, max: number, n: number) {
  const ids: number[] = [];

  while (ids.length < n) {
    let potentialId = Math.floor(Math.random() * (max - min + 1)) + min;

    if (
      !ids.includes(potentialId) &&
      !ids.includes(potentialId - 1) &&
      !ids.includes(potentialId + 1)
    ) {
      ids.push(potentialId);
    }
  }

  return ids;
}

async function GET(
  request: NextRequest,
  route: { params: { count: string } }
) {
  // Fetch minimum and maximum IDs
  const minMax = await prisma.acronym.aggregate({
    _min: {
      id: true,
    },
    _max: {
      id: true,
    },
  });

  const minId = minMax._min.id;
  const maxId = minMax._max.id;

  // Generate random, non-adjacent IDs
  const selectedIds = generateNonAdjencantRandomIds(minId, maxId, Number(route.params.count));

  const selectedEntities = await prisma.acronym.findMany({
    where: {
      id: {
        in: selectedIds,
      },
    },
  });

  return { data: selectedEntities };
}

GET.validationSchemes = {
  params: Joi.object({
    count: Joi.number().positive().required()
  }),
}

module.exports = apiHandler({ GET });
