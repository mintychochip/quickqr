import {v4} from "uuid";

export class UUID {
  readonly uuid: string

  private constructor(uuid: string) {
    this.uuid = uuid;
  }

  static create(): UUID {
    return new UUID(v4());
  }

  static fromString(uuid: string): UUID {
    return new UUID(uuid);
  }

  toString(): string {
    return this.uuid;
  }
}
