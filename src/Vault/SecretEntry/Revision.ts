import type { Author } from "../../Author"

export class Revision {
	constructor(readonly createdAt: number, readonly value: string, readonly author: Author) {}
}
