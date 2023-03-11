import type { VaultRepository } from "../VaultRepository"
import { Vault } from "../../Vault"
import { VaultId } from "../VaultId"
import { VaultNotFoundError } from "./Error/VaultNotFoundError"
import type { Author } from "../../Author"
import type { VaultName } from "../VaultName"

export class InMemoryRepository implements VaultRepository {
	constructor(private vaults: Vault[]) {}

	public async create(owner: Author, name: VaultName): Promise<Vault> {
		const vaultCount = this.vaults.length + 1
		const id = new VaultId(`VID-${vaultCount}`)

		const vault = new Vault(id, owner, name, [])

		this.vaults = [...this.vaults, vault]

		return await Promise.resolve(vault)
	}

	public async update(vault: Vault): Promise<Vault> {
		const existingVault = this.vaults.find((v: Vault) => v.id.value === vault.id.value)

		if (existingVault === undefined) {
			return await Promise.reject(new VaultNotFoundError())
		}

		this.vaults = this.vaults.map((v: Vault) => (v.id.value === vault.id.value ? vault : v))

		return await Promise.resolve(vault)
	}

	public async findByAccount(accountId: Author): Promise<VaultId[]> {
		const vaults = this.vaults.filter((vault: Vault) => vault.owner.value === accountId.value)

		return await Promise.resolve(vaults.map((vault: Vault) => vault.id))
	}
}
