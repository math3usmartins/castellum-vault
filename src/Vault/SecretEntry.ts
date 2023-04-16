import { Revision } from "./SecretEntry/Revision"
import type { Author } from "../Author"
import type { SecretValue } from "./SecretEntry/SecretValue"

export class SecretEntry {
	private constructor(readonly name: string, readonly revision: string, private readonly _revisions: Revision[]) {}

	public static create(name: string, author: Author, createdAt: number, value: SecretValue): SecretEntry {
		const revision = Revision.create(createdAt, value, author)

		return new SecretEntry(name, revision.id, [revision])
	}

	public update(value: SecretValue, createdAt: number, author: Author): SecretEntry {
		const newRevision = Revision.create(createdAt, value, author)

		return new SecretEntry(this.name, newRevision.id, [...this._revisions, newRevision])
	}

	public archive(archivedAt: number, archivedBy: Author): SecretEntry {
		const archived = this.current().archive(archivedBy, archivedAt)

		return new SecretEntry(this.name, archived.id, [...this._revisions, archived])
	}

	public revisions(): Revision[] {
		return [...this._revisions]
	}

	public merge(anotherEntry: SecretEntry): SecretEntry {
		const intersection = this.revisions().filter(
			(rev) => anotherEntry.revisions().find((anotherRev) => anotherRev.id === rev.id) !== undefined,
		)

		const previousOnly = this.revisions().filter(
			(rev) => anotherEntry.revisions().find((anotherRev) => anotherRev.id === rev.id) === undefined,
		)

		const newOnly = anotherEntry
			.revisions()
			.filter((anotherRev) => this.revisions().find((thisRev) => thisRev.id === anotherRev.id) === undefined)

		const revisions = [...intersection, ...previousOnly, ...newOnly]

		return new SecretEntry(this.name, anotherEntry.revision, revisions)
	}

	public current(): Revision {
		const revision = this._revisions.find((rev) => rev.id === this.revision)

		if (revision === undefined) {
			throw new Error(`Current revision not found: ${this.revision}`)
		}

		return revision
	}
}
