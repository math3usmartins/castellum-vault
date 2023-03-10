import type { Account } from "../Account"
import type { Vault } from "../Vault"
import type { VaultRepository } from "./VaultRepository"
import type { VaultId } from "./VaultId"

export class VaultManager {
	constructor(private readonly account: Account, private readonly repository: VaultRepository) {}

	public async create(name: string): Promise<Vault> {
		return await this.repository.create(this.account.id, name)
	}

	public async update(vault: Vault): Promise<Vault> {
		return await this.repository.update(vault)
	}

	public async find(): Promise<VaultId[]> {
		return await this.repository.findByAccount(this.account.id)
	}
}
