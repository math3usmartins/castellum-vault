import assert from "assert"
import "mocha"
import { Seed } from "../MultiFactorAuth/Seed"
import { InMemoryRepository as AccountRepository } from "../Account/Repository/InMemoryRepository"
import { InMemoryRepository as LoginSessionRepository } from "./Repository/InMemoryRepository"
import { LoginManager } from "./LoginManager"
import { InMemoryValidator } from "./Validator/InMemoryValidator"
import { LoginInput } from "./LoginInput"
import { Account } from "../Account"
import { SeedCollection } from "../MultiFactorAuth/SeedCollection"
import { AccountId } from "../Account/AccountId"

describe("LoginManager", () => {
	const seed = new Seed("seed-123")
	const email = "someone@acme.org"
	const token = "access-token"
	const mfaCode = "mfa-code"

	it("must create session when input is valid", async () => {
		const accountRepository = new AccountRepository([])

		await accountRepository.save(new Account(new AccountId("user-1"), email, SeedCollection.with([seed.active()])))

		const manager = new LoginManager(
			accountRepository,
			new LoginSessionRepository(),
			new InMemoryValidator(email, token, mfaCode),
		)

		const session = await manager.login(new LoginInput(email, token, mfaCode))

		assert.equal(session.id, "SID-1")
		assert.equal(session.email, email)
	})

	it("must fail when account is NOT FOUND", async () => {
		const accountRepository = new AccountRepository([])

		const manager = new LoginManager(
			accountRepository,
			new LoginSessionRepository(),
			new InMemoryValidator(email, token, mfaCode),
		)

		const failed = await manager
			.login(new LoginInput(email, token, mfaCode))
			.then(() => false)
			.catch(() => true)

		assert.equal(failed, true)
	})

	it("must fail when account is NOT active", async () => {
		const accountRepository = new AccountRepository([])

		await accountRepository.save(
			new Account(new AccountId("user-1"), email, SeedCollection.with([seed.inactive()])),
		)

		const manager = new LoginManager(
			accountRepository,
			new LoginSessionRepository(),
			new InMemoryValidator(email, token, mfaCode),
		)

		const failed = await manager
			.login(new LoginInput(email, token, mfaCode))
			.then(() => false)
			.catch(() => true)

		assert.equal(failed, true)
	})
})
