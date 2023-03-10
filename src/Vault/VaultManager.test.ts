import assert from "assert"
import "mocha"
import { InMemoryRepository } from "./Repository/InMemoryRepository"
import { AccountId } from "../Account/AccountId"
import { VaultManager } from "./VaultManager"
import { Account } from "../Account"
import { SeedCollection } from "../MultiFactorAuth/SeedCollection"
import { SecretEntry } from "./SecretEntry"

describe("VaultManager", () => {
	const account = new Account(new AccountId("user-1"), "someone@acme.org", new SeedCollection())

	it("must create a vault with given owner", async () => {
		const repository = new InMemoryRepository([])
		const manager = new VaultManager(account, repository)
		const vault = await manager.create("my-vault")

		assert.equal(vault.owner.value, "user-1")
	})

	it("must update a vault", async () => {
		const repository = new InMemoryRepository([])
		const manager = new VaultManager(account, repository)

		let vault = await manager.create("my-vault")
		const secret = SecretEntry.create(new AccountId("user-1"), 1677910538, "my-secret-entry", "my-secret-value")
		vault = vault.put(secret)

		vault = await manager.update(vault)

		assert.equal(vault.owner.value, "user-1")
		assert.deepStrictEqual(vault.secrets(), [secret])
	})

	it("must find vaults", async () => {
		const repository = new InMemoryRepository([])
		const manager = new VaultManager(account, repository)

		const personalVault = await manager.create("my-vault")
		const professionalVault = await manager.create("pro-vault")
		const result = await manager.find()

		assert.deepStrictEqual(result, [personalVault.id, professionalVault.id])
	})
})
