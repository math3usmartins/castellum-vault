import type { Vault } from "../Vault"
import type { VaultId } from "./VaultId"
import type { Author } from "../Author"

export interface VaultRepository {
	create: (owner: Author, name: string) => Promise<Vault>
	update: (vault: Vault) => Promise<Vault>
	findByAccount: (accountId: Author) => Promise<VaultId[]>
}
