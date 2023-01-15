import assert from "assert"
import "mocha"
import { Seed } from "../MultiFactorAuth/Seed"
import { SignUpInput } from "./SignUpInput"
import { SeedCollection } from "../MultiFactorAuth/SeedCollection"
import { ActivateInput } from "./ActivateInput"
import { SignUpManagerTestContext } from "./Test/SignUpManagerTestContext"
import { InvalidMultiFactorAuthError } from "../MultiFactorAuth/Validator/Error/InvalidMultiFactorAuthError"
import { AccountIsAlreadyActiveError } from "./Error/AccountIsAlreadyActiveError"
import { SeedNotFoundError } from "./Error/SeedNotFoundError"
import { Account } from "../Account"
import { AccountId } from "../Account/AccountId"

const email = "someone@acme.org"
const validToken = "abc123xyz789"
const inactiveSeed = new Seed("seed-123").inactive()
const mfaSeed = inactiveSeed.active()
const mfaCode = "112233"

const createContext = (): SignUpManagerTestContext =>
	SignUpManagerTestContext.create(email, validToken, inactiveSeed, mfaSeed, mfaCode)

describe("SignUpManager.signup()", () => {
	it("must return seed to activate account", async () => {
		const { manager } = createContext()

		const output = await manager.signup(new SignUpInput(email, validToken))

		assert.strictEqual(output.seed.value, inactiveSeed.value)
	})

	it("must create new account with inactive MFA seed", async () => {
		const { manager, repository } = createContext()

		await manager.signup(new SignUpInput(email, validToken))

		const account = await repository.getByEmail(email)

		assert.equal(account?.isActive(), false)
		assert.deepStrictEqual(account?.multiFactorConfigCollection, SeedCollection.with([inactiveSeed]))
	})

	it("must fail when account is already active", async () => {
		const { manager } = createContext()

		await manager.signup(new SignUpInput(email, validToken))

		await manager.activate(new ActivateInput(email, validToken, mfaCode))

		const failed = await manager
			.signup(new SignUpInput(email, validToken))
			.then((_output) => {
				console.log(_output)
				return false
			})
			.catch((_err) => {
				return true
			})

		assert.equal(failed, true)
	})

	it("must fail when token is NOT valid", async () => {
		const { manager } = createContext()

		await manager.signup(new SignUpInput(email, validToken))

		const failed = await manager
			.signup(new SignUpInput(email, "invalid-token"))
			.then(() => false)
			.catch(() => true)

		assert.equal(failed, true)
	})
})

describe("SignUpManager.activate()", () => {
	it("must activate account", async () => {
		const { manager, repository } = createContext()

		await manager.signup(new SignUpInput(email, validToken))

		await manager.activate(new ActivateInput(email, validToken, mfaCode))

		const account = await repository.getByEmail(email)

		assert.equal(account.isActive(), true)
		assert.deepStrictEqual(account.multiFactorConfigCollection.getActive(), inactiveSeed.active())
	})

	it("must fail when MFA code is not valid", async () => {
		const { manager } = createContext()

		await manager.signup(new SignUpInput(email, validToken))

		const failed = await manager
			.activate(new ActivateInput(email, validToken, "badcode"))
			.then(() => false)
			.catch((reason) => reason instanceof InvalidMultiFactorAuthError)

		assert.equal(failed, true)
	})

	it("must fail when account doesn't have any MFA seed", async () => {
		const { manager, repository } = createContext()

		await manager.signup(new SignUpInput(email, validToken))

		// overwrite account, to simulate it doesn't contain any MFA seeds
		await repository.save(new Account(new AccountId("user-1"), email, SeedCollection.with([])))

		const failed = await manager
			.activate(new ActivateInput(email, validToken, mfaCode))
			.then(() => false)
			.catch((reason) => {
				return reason instanceof SeedNotFoundError
			})

		assert.equal(failed, true)
	})

	it("must fail when account is already active", async () => {
		const { manager } = createContext()

		await manager.signup(new SignUpInput(email, validToken))

		await manager.activate(new ActivateInput(email, validToken, mfaCode))

		const failed = await manager
			.activate(new ActivateInput(email, validToken, mfaCode))
			.then(() => false)
			.catch((reason) => reason instanceof AccountIsAlreadyActiveError)

		assert.equal(failed, true)
	})
})
