import type { Author } from "../../Author"
import type { SecretValue } from "./SecretValue"

export class Revision {
	constructor(readonly createdAt: number, readonly value: SecretValue, readonly author: Author) {}
}
