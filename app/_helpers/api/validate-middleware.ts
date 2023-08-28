import joi from 'joi';
import { NextRequest } from 'next/server';

export { validateMiddleware };

interface IValidationSchemes {
  query: joi.ObjectSchema;
  params: joi.ObjectSchema;
  body: joi.ObjectSchema;
}

async function validateMiddleware(req: NextRequest, schemes: IValidationSchemes, route: any) {
  if (!schemes.query && !schemes.params && !schemes.body) return;

  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true, // remove unknown props
  };

  if (schemes.body) {
    const body = await req.json();
    const { error, value } = schemes.body.validate(body, options);

    if (error) {
      throw `Validation error: ${error.details.map((x) => x.message).join(", ")}`;
    }

    // update req.json() to return sanitized req body
    req.json = () => value;
  }

  if (schemes.query) {
    const searchParams = await req.nextUrl.searchParams;
    console.log('searchParams !', searchParams)

    const searchKeys = Object.keys(schemes.query.describe().keys);
    const queryObject: any = {};
    searchKeys.forEach(key => {
      if (searchParams.get(key)) {
        queryObject[key] = searchParams.get(key);
      }
    });

    const { error, value } = schemes.query.validate(queryObject, options);

    if (error) {
      throw `Query Validation error: ${error.details.map((x) => x.message).join(", ")}`;
    }
  }

  if (schemes.params) {
    const routeParams = route.params;
    const routeParamKeys = Object.keys(schemes.params.describe().keys);
    const paramsObject: any = {};
    routeParamKeys.forEach(key => {
      paramsObject[key] = routeParams[key];
    });

    const { error, value } = schemes.params.validate(paramsObject, options);

    if (error) {
      throw `Params Validation error: ${error.details.map((x) => x.message).join(", ")}`;
    }
  }
}
