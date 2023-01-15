import assert from "assert"
import "mocha"
import { Account } from "./Account"
import { SeedCollection } from "./MultiFactorAuth/SeedCollection"
import { Seed } from "./MultiFactorAuth/Seed"
import { AccountId } from "./Account/AccountId"

describe("Account", () => {
	it("it must add multi factor auth seed", () => {
		const account = new Account(new AccountId("user-1"), "someone@acme.org", new SeedCollection())

		const multiFactorAuthSeed = new Seed("seed-123").active()
		const accountWithActiveMultiFactorAuthSeed = account.addMultiFactorAuthSeed(multiFactorAuthSeed)

		// new account instance must have been updated
		assert.equal(true, accountWithActiveMultiFactorAuthSeed.isActive())
		assert.deepStrictEqual(
			accountWithActiveMultiFactorAuthSeed.multiFactorConfigCollection.getActive(),
			multiFactorAuthSeed,
		)

		// previous account instance MUST remains unchanged
		assert.equal(false, account.isActive())
		assert.equal(account.multiFactorConfigCollection.getActive(), null)
	})
})
