import { Revision } from "./SecretEntry/Revision"
import type { AccountId } from "../Account/AccountId"

export class SecretEntry {
	constructor(
		readonly author: AccountId,
		readonly name: string,
		readonly createdAt: number,
		readonly value: string,
		readonly _revisions: Revision[],
		readonly archivedAt: number | null,
	) {}

	public update(value: string, createdAt: number, author: AccountId): SecretEntry {
		const newRevision = new Revision(this.createdAt, this.value)

		return new SecretEntry(author, this.name, createdAt, value, [...this._revisions, newRevision], null)
	}

	public archive(archivedAt: number, archivedBy: AccountId): SecretEntry {
		return new SecretEntry(archivedBy, this.name, this.createdAt, this.value, [...this._revisions], archivedAt)
	}

	public revisions(): Revision[] {
		return [...this._revisions]
	}
}
