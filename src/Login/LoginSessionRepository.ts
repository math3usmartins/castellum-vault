import type { Account } from "../Account"
import type { LoginSession } from "./LoginSession"

export interface LoginSessionRepository {
	create: (account: Account) => Promise<LoginSession>
}
