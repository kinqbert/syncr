import { DbProvider } from "../db/db.provider";

export abstract class BaseRepository {
  protected constructor(protected readonly dbProvider: DbProvider) {}

  protected get db() {
    return this.dbProvider.db;
  }
}
