import {
  CanActivate,
  ExecutionContext,
  Injectable,
  MethodNotAllowedException,
} from "@nestjs/common";
import { Request } from "express";

import { isDemoRequest } from "../demo";

const READ_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

@Injectable()
export class DemoReadonlyGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    if (!isDemoRequest(request) || READ_METHODS.has(request.method)) {
      return true;
    }

    throw new MethodNotAllowedException("Demo mode is read-only");
  }
}
