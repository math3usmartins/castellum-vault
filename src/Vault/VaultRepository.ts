import type { AccountId } from "../Account/AccountId"
import type { Vault } from "../Vault"
import type { VaultId } from "./VaultId"

export interface VaultRepository {
	create: (owner: AccountId, name: string) => Promise<Vault>
	update: (vault: Vault) => Promise<Vault>
	findByAccount: (accountId: AccountId) => Promise<VaultId[]>
}
