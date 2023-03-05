import { InMemoryRepository } from "../../Account/Repository/InMemoryRepository"
import { SignUpManager } from "../SignUpManager"
import { InMemoryValidator } from "../TokenValidator/InMemoryValidator"
import { InMemorySeedGenerator } from "../../MultiFactorAuth/SeedGenerator/InMemorySeedGenerator"
import { InMemoryMultiFactorAuthValidator } from "../../MultiFactorAuth/Validator/InMemoryMultiFactorAuthValidator"
import type { Seed } from "../../MultiFactorAuth/Seed"

export class SignUpManagerTestContext {
	constructor(public readonly repository: InMemoryRepository, public readonly manager: SignUpManager) {}

	public static create(
		email: string,
		validToken: string,
		inactiveSeed: Seed,
		mfaSeed: Seed,
		mfaCode: string,
	): SignUpManagerTestContext {
		const repository = new InMemoryRepository([])

		const manager = new SignUpManager(
			new InMemoryValidator(email, validToken),
			repository,
			new InMemorySeedGenerator(inactiveSeed),
			new InMemoryMultiFactorAuthValidator(mfaSeed.value, mfaCode),
		)

		return new SignUpManagerTestContext(repository, manager)
	}
}
