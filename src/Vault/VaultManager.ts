import type { Account } from "../Account"
import type { Vault } from "../Vault"
import type { VaultRepository } from "./VaultRepository"

export class VaultManager {
	constructor(private readonly account: Account, private readonly repository: VaultRepository) {}

	public async create(name: string): Promise<Vault> {
		return await this.repository.create(this.account.id, name)
	}

	public async update(vault: Vault): Promise<Vault> {
		return await this.repository.update(vault)
	}
}
