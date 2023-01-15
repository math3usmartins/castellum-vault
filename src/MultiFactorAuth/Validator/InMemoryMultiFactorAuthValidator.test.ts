import assert from "assert"
import "mocha"
import { InMemoryMultiFactorAuthValidator } from "./InMemoryMultiFactorAuthValidator"
import { InvalidMultiFactorAuthError } from "./Error/InvalidMultiFactorAuthError"

const validSeed = "seed-123"
const validCode = "112233"

describe("InMemoryMultiFactorAuthValidator", () => {
	it("must accept valid seed & MFA code", async () => {
		const validator = new InMemoryMultiFactorAuthValidator(validSeed, validCode)

		const isValid = await validator
			.validate(validSeed, validCode)
			.then(() => true)
			.catch(() => false)

		assert.equal(true, isValid)
	})

	it("must reject invalid seed", async () => {
		const validator = new InMemoryMultiFactorAuthValidator(validSeed, validCode)

		const rejected = await validator
			.validate("bad-seed", validCode)
			.then(() => false)
			.catch((reason) => reason instanceof InvalidMultiFactorAuthError)

		assert.equal(true, rejected)
	})

	it("must reject invalid seed", async () => {
		const validator = new InMemoryMultiFactorAuthValidator(validSeed, validCode)

		const rejected = await validator
			.validate(validSeed, "bad-code")
			.then(() => false)
			.catch((reason) => reason instanceof InvalidMultiFactorAuthError)

		assert.equal(true, rejected)
	})
})
