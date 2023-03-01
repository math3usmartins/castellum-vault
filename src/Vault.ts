import type { SecretEntry } from "./Vault/SecretEntry"
import type { AccountId } from "./Account/AccountId"

export class Vault {
	constructor(readonly owner: AccountId, readonly name: string, readonly _secrets: SecretEntry[]) {}

	public put(secret: SecretEntry): Vault {
		const existingSecret = this._secrets.find((s: SecretEntry): boolean => s.name === secret.name)

		return existingSecret === undefined
			? new Vault(this.owner, this.name, [...this._secrets, secret])
			: this.updateSecret(secret, existingSecret)
	}

	public archive(name: string, archivedAt: number, author: AccountId): Vault {
		const entries = this._secrets.map(
			(entry: SecretEntry): SecretEntry => (entry.name === name ? entry.archive(archivedAt, author) : entry),
		)

		return new Vault(this.owner, this.name, entries)
	}

	private updateSecret(newEntry: SecretEntry, existingEntry: SecretEntry): Vault {
		const updatedSecret = existingEntry.update(newEntry.value, newEntry.createdAt, newEntry.author)

		const secrets = this._secrets.map(
			(s: SecretEntry): SecretEntry => (s.name === newEntry.name ? updatedSecret : s),
		)

		return new Vault(this.owner, this.name, [...secrets])
	}

	public secrets(): SecretEntry[] {
		return [...this._secrets]
	}
}
