import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { NextFunction, Request, Response } from "express";

import { AppModule } from "./app.module";
import { runWithDemoContext } from "./common/demo";
import { CONFIG } from "./config/configuration";
import { seedDb } from "./config/seed";

const getDemoClientUrl = () => {
  const url = new URL(CONFIG.CLIENT_URL);
  url.hostname = `demo.${url.hostname}`;

  return url.origin;
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.use((req: Request, _res: Response, next: NextFunction) => {
    runWithDemoContext(req, next);
  });

  app.setGlobalPrefix("api");

  app.enableCors({
    origin: [CONFIG.CLIENT_URL, getDemoClientUrl()],
    credentials: true,
  });

  await seedDb();

  await app.listen(process.env.PORT ?? 3000);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
