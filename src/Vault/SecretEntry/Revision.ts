import type { Author } from "../../Author"
import type { SecretValue } from "./SecretValue"
import { webcrypto } from "crypto"

export class Revision {
	constructor(
		readonly id: string,
		readonly createdAt: number,
		readonly value: SecretValue,
		readonly author: Author,
		readonly archived: boolean,
	) {}

	public static create(createdAt: number, value: SecretValue, author: Author): Revision {
		return new Revision(webcrypto.randomUUID(), createdAt, value, author, false)
	}

	public archive(archivedBy: Author, archivedAt: number): Revision {
		return new Revision(webcrypto.randomUUID(), archivedAt, this.value, archivedBy, true)
	}
}
