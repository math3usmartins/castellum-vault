import assert from "assert"
import "mocha"
import { InMemoryValidator } from "./InMemoryValidator"
import { SignUpInput } from "../SignUpInput"

const email = "someone@acme.org"
const validToken = "abc123xyz789"

describe("InMemoryValidator", (): void => {
	it("must accept valid token", async () => {
		const validator = new InMemoryValidator(email, validToken)

		const isValid = await validator
			.validate(new SignUpInput(email, validToken))
			.then(() => true)
			.catch(() => false)

		assert.equal(isValid, true)
	})

	it("must reject invalid token", async () => {
		const validator = new InMemoryValidator(email, validToken)

		const isValid = await validator
			.validate(new SignUpInput(email, "bad-token"))
			.then(() => true)
			.catch(() => false)

		assert.equal(isValid, false)
	})

	it("must reject invalid email", async () => {
		const validator = new InMemoryValidator(email, validToken)

		const isValid = await validator
			.validate(new SignUpInput("bad-email", validToken))
			.then(() => true)
			.catch(() => false)

		assert.equal(isValid, false)
	})
})
