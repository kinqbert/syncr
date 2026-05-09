import { Injectable } from "@nestjs/common";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

import { CONFIG } from "../../config/configuration";

@Injectable()
export class TokenCryptoService {
  private readonly key = createHash("sha256").update(CONFIG.CALENDAR_TOKEN_SECRET).digest();

  encrypt(value: string) {
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", this.key, iv);
    const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return [iv, authTag, encrypted].map((part) => part.toString("base64url")).join(".");
  }

  decrypt(value: string) {
    const [ivValue, authTagValue, encryptedValue] = value.split(".");

    if (!ivValue || !authTagValue || !encryptedValue) {
      return value;
    }

    const decipher = createDecipheriv("aes-256-gcm", this.key, Buffer.from(ivValue, "base64url"));

    decipher.setAuthTag(Buffer.from(authTagValue, "base64url"));

    return Buffer.concat([
      decipher.update(Buffer.from(encryptedValue, "base64url")),
      decipher.final(),
    ]).toString("utf8");
  }
}
