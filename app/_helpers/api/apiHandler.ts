import { NextRequest, NextResponse } from 'next/server';

import { errorHandler } from './error-handler';
import { jwtMiddleware } from './jwt-middleware';
import { validateMiddleware } from './validate-middleware';

export const apiHandler = (handler: any) => {
  const wrappedHandler: any = {};
  const httpMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

  // wrap handler methods to add middleware and global error handler
  httpMethods.forEach((method) => {
    if (typeof handler[method] !== "function") return;

    wrappedHandler[method] = async (req: NextRequest, route: any, ...args: any) => {
      try {
        // monkey patch req.json() because it can only be called once
        const json = await req.json();
        req.json = () => json;
      } catch {}

      try {
        // global middleware
        await jwtMiddleware(req);
        await validateMiddleware(req, handler[method].validationSchemes, route);

        // route handler
        const response = await handler[method](req, route, ...args);
        return NextResponse.json(response.data || {}, response.ops || {});
      } catch (err: any) {
        // global error handler
        return errorHandler(err);
      }
    };
  });

  return wrappedHandler;
}
