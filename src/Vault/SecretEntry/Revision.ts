import type { Author } from "../../Author"

export class Revision {
	constructor(readonly _createdAt: number, readonly _value: string, _author: Author) {}
}
