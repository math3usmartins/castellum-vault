import type { Account } from "../Account"
import type { SignUpTokenValidator } from "./SignUpTokenValidator"
import type { AccountRepository } from "../Account/AccountRepository"
import type { SeedGenerator } from "../MultiFactorAuth/SeedGenerator"
import { SignUpInput } from "./SignUpInput"
import { SignUpOutput } from "./SignUpOutput"
import { AccountIsAlreadyActiveError } from "./Error/AccountIsAlreadyActiveError"
import type { ActivateInput } from "./ActivateInput"
import { SeedNotFoundError } from "./Error/SeedNotFoundError"
import type { MultiFactorAuthValidator } from "../MultiFactorAuth/MultiFactorAuthValidator"
import { AccountNotFoundError } from "../Account/Repository/Error/AccountNotFoundError"

export class SignUpManager {
	constructor(
		private readonly signUpTokenValidator: SignUpTokenValidator,
		private readonly repository: AccountRepository,
		private readonly seedGenerator: SeedGenerator,
		private readonly mfaValidator: MultiFactorAuthValidator,
	) {}

	public async signup(input: SignUpInput): Promise<SignUpOutput> {
		await this.signUpTokenValidator.validate(input)

		return await this.repository
			.getByEmail(input.email)
			.then(async (account) => await this.signUpExistingAccount(account))
			.catch(async (reason) =>
				reason instanceof AccountNotFoundError
					? await this.signUpNewAccount(input.email)
					: await Promise.reject(reason),
			)
	}

	public async activate(input: ActivateInput): Promise<void> {
		await this.signUpTokenValidator.validate(new SignUpInput(input.email, input.token))

		const account: Account = await this.repository.getByEmail(input.email)

		if (account.isActive()) {
			await Promise.reject(new AccountIsAlreadyActiveError())
			return
		}

		const seed = account.multiFactorConfigCollection.firstIfAny()

		if (seed == null) {
			await Promise.reject(new SeedNotFoundError())
			return
		}

		await this.mfaValidator.validate(seed.value, input.mfaCode)

		await this.repository.save(account.active(seed))
	}

	private async signUpNewAccount(email: string): Promise<SignUpOutput> {
		const seed = (await this.seedGenerator.generate()).inactive()

		await this.repository.create(email, seed)

		return new SignUpOutput(seed)
	}

	private async signUpExistingAccount(account: Account): Promise<SignUpOutput> {
		// if account is not active yet, handle it as new one, generating a new seed
		return account.isActive()
			? await Promise.reject(new AccountIsAlreadyActiveError())
			: await this.signUpNewAccount(account.email)
	}
}
