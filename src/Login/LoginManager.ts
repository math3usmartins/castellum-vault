import type { LoginSessionRepository } from "./LoginSessionRepository"
import type { AccountRepository } from "../Account/AccountRepository"
import type { LoginValidator } from "./LoginValidator"
import type { LoginInput } from "./LoginInput"
import type { LoginSession } from "./LoginSession"
import { BadLoginInput } from "./Validator/Error/BadLoginInput"

export class LoginManager {
	constructor(
		private readonly accounts: AccountRepository,
		private readonly sessions: LoginSessionRepository,
		private readonly loginValidator: LoginValidator,
	) {}

	public async login(input: LoginInput): Promise<LoginSession> {
		const account = await this.accounts.getByEmail(input.email)

		if (!account.isActive()) {
			return await Promise.reject(new BadLoginInput())
		}

		await this.loginValidator.validate(input)

		return await this.sessions.create(account)
	}
}
