import type { Account } from "../Account"
import type { Seed } from "../MultiFactorAuth/Seed"

export interface AccountRepository {
	create: (email: string, seed: Seed) => Promise<Account>

	save: (account: Account) => Promise<void>

	getByEmail: (email: string) => Promise<Account>
}
