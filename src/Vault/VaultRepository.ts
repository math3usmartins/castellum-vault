import type { AccountId } from "../Account/AccountId"
import type { Vault } from "../Vault"

export interface VaultRepository {
	create: (owner: AccountId, name: string) => Promise<Vault>
	update: (vault: Vault) => Promise<Vault>
}
