import assert from "assert"
import "mocha"
import { InMemoryRepository } from "./InMemoryRepository"
import { Account } from "../../Account"
import { Seed } from "../../MultiFactorAuth/Seed"
import { SeedCollection } from "../../MultiFactorAuth/SeedCollection"
import { AccountId } from "../../Account/AccountId"

const seed = new Seed("seed-123").active()
const email = "someone@acme.org"

describe("InMemoryRepository", () => {
	it("is must create session", async () => {
		const repository = new InMemoryRepository()

		const account = new Account(new AccountId("user-1"), email, SeedCollection.with([seed]))

		const session = await repository.create(account)

		assert.equal(session.id, "SID-1")
		assert.equal(session.email, email)
	})

	it("is must create another session", async () => {
		const repository = new InMemoryRepository()

		const account = new Account(new AccountId("user-1"), email, SeedCollection.with([seed]))

		const session = await repository.create(account)
		const anotherSession = await repository.create(account)

		assert.equal(anotherSession.id, "SID-2")
		assert.equal(anotherSession.email, email)
		assert.deepStrictEqual(repository, InMemoryRepository.withAlreadyExistingSession([session, anotherSession]))
	})
})
