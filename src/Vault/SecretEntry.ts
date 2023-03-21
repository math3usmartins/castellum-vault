import { Revision } from "./SecretEntry/Revision"
import type { Author } from "../Author"

export class SecretEntry {
	constructor(
		readonly author: Author,
		readonly name: string,
		readonly createdAt: number,
		readonly value: string,
		readonly _revisions: Revision[],
		readonly archivedAt: number | null,
	) {}

	public static create(author: Author, createdAt: number, name: string, value: string): SecretEntry {
		return new SecretEntry(author, name, createdAt, value, [], null)
	}

	public update(value: string, createdAt: number, author: Author): SecretEntry {
		const newRevision = new Revision(this.createdAt, this.value, this.author)

		return new SecretEntry(author, this.name, createdAt, value, [...this._revisions, newRevision], null)
	}

	public archive(archivedAt: number, archivedBy: Author): SecretEntry {
		return new SecretEntry(archivedBy, this.name, this.createdAt, this.value, [...this._revisions], archivedAt)
	}

	public revisions(): Revision[] {
		return [...this._revisions]
	}
}
