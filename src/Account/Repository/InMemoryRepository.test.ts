import assert from "assert"
import "mocha"
import { InMemoryRepository } from "./InMemoryRepository"
import { Account } from "../../Account"
import { SeedCollection } from "../../MultiFactorAuth/SeedCollection"
import { Seed } from "../../MultiFactorAuth/Seed"
import { AccountId } from "../AccountId"

describe("InMemoryRepository", () => {
	const email = "someone@acme.org"
	const anotherEmail = "someone-else@acme.org"

	it("must create an account with auto-generated ID", async () => {
		const seed = new Seed("sed-123")
		const repository = new InMemoryRepository([])

		await repository.create(email, seed)

		const actual = await repository.getByEmail(email)

		const account = new Account(new AccountId("user-1"), email, SeedCollection.with([seed]))

		assert.deepStrictEqual(actual, account)
	})

	it("must get by email", async () => {
		const account = new Account(new AccountId("user-1"), email, SeedCollection.with([]))

		const anotherAccount = new Account(new AccountId("user-2"), anotherEmail, SeedCollection.with([]))

		const repository = new InMemoryRepository([anotherAccount, account])

		const actual = await repository.getByEmail(email)

		assert.deepStrictEqual(actual, account)
	})

	it("must update a given account", async () => {
		const account = new Account(new AccountId("user-1"), email, SeedCollection.with([]))

		const anotherAccount = new Account(new AccountId("user-2"), anotherEmail, SeedCollection.with([]))

		const repository = new InMemoryRepository([anotherAccount, account])

		const accountWithSeed = account.addMultiFactorAuthSeed(new Seed("seed-123"))
		await repository.save(accountWithSeed)

		const actualAccount = await repository.getByEmail(email)
		assert.deepStrictEqual(actualAccount, accountWithSeed)

		const actualAnotherAccount = await repository.getByEmail(anotherEmail)
		assert.deepStrictEqual(actualAnotherAccount, anotherAccount)
	})
})
