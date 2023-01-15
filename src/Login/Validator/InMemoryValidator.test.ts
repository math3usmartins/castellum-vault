import assert from "assert"
import "mocha"
import { InMemoryValidator } from "./InMemoryValidator"
import { LoginInput } from "../LoginInput"
import { BadLoginInput } from "./Error/BadLoginInput"

const email = "someone@acme.org"
const token = "access-token"
const mfaCode = "mfa-code"

describe("InMemoryRepository", () => {
	it("is must accept valid input", async () => {
		const validator = new InMemoryValidator(email, token, mfaCode)

		const isValid = await validator
			.validate(new LoginInput(email, token, mfaCode))
			.then(() => true)
			.catch(() => false)

		assert.equal(isValid, true)
	})

	it("is must reject bad email", async () => {
		const validator = new InMemoryValidator(email, token, mfaCode)

		const rejected = await validator
			.validate(new LoginInput("someone-else@acme.org", token, mfaCode))
			.then(() => false)
			.catch((reason) => reason instanceof BadLoginInput)

		assert.equal(rejected, true)
	})

	it("is must reject bad token", async () => {
		const validator = new InMemoryValidator(email, token, mfaCode)

		const rejected = await validator
			.validate(new LoginInput(email, "badtoken", mfaCode))
			.then(() => false)
			.catch((reason) => reason instanceof BadLoginInput)

		assert.equal(rejected, true)
	})

	it("is must reject bad MFA code", async () => {
		const validator = new InMemoryValidator(email, token, mfaCode)

		const rejected = await validator
			.validate(new LoginInput(email, token, "badcode"))
			.then(() => false)
			.catch((reason) => reason instanceof BadLoginInput)

		assert.equal(rejected, true)
	})
})
