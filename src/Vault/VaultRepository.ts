import type { Vault } from "../Vault"
import type { VaultId } from "./VaultId"
import type { Author } from "../Author"
import type { VaultName } from "./VaultName"

export interface VaultRepository {
	create: (owner: Author, name: VaultName) => Promise<Vault>
	update: (vault: Vault) => Promise<Vault>
	findByAccount: (accountId: Author) => Promise<VaultId[]>
}
