import type { SecretEntry } from "./Vault/SecretEntry"
import type { VaultId } from "./Vault/VaultId"
import type { Author } from "./Author"
import type { VaultName } from "./Vault/VaultName"

export class Vault {
	constructor(
		readonly id: VaultId,
		readonly owner: Author,
		readonly name: VaultName,
		readonly _secrets: SecretEntry[],
	) {}

	public secrets(): SecretEntry[] {
		return [...this._secrets]
	}

	public getByName(name: string): SecretEntry {
		const secret = this._secrets.find((s) => s.name === name)

		if (secret === undefined) {
			throw new Error(`No entry found with name "${name}"`)
		}

		return secret
	}

	public put(secret: SecretEntry): Vault {
		const existingSecret = this._secrets.find((s: SecretEntry): boolean => s.name === secret.name)

		return existingSecret === undefined
			? new Vault(this.id, this.owner, this.name, [...this._secrets, secret])
			: this.updateEntry(secret, existingSecret)
	}

	public archive(name: string, archivedAt: number, author: Author): Vault {
		const entries = this._secrets.map(
			(entry: SecretEntry): SecretEntry => (entry.name === name ? entry.archive(archivedAt, author) : entry),
		)

		return new Vault(this.id, this.owner, this.name, entries)
	}

	private updateEntry(newEntry: SecretEntry, existingEntry: SecretEntry): Vault {
		const updatedSecret = existingEntry.merge(newEntry)

		const secrets = this._secrets.map(
			(s: SecretEntry): SecretEntry => (s.name === newEntry.name ? updatedSecret : s),
		)

		return new Vault(this.id, this.owner, this.name, [...secrets])
	}
}
