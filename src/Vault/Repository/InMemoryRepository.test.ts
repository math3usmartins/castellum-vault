import assert from "assert"
import "mocha"
import { InMemoryRepository } from "./InMemoryRepository"
import { SecretEntry } from "../SecretEntry"
import { Vault } from "../../Vault"
import { VaultId } from "../VaultId"
import { VaultNotFoundError } from "./Error/VaultNotFoundError"
import { Author } from "../../Author"

describe("in memory vault repository", () => {
	it("must create a vault with auto-generated ID", async () => {
		const repository = new InMemoryRepository([])
		const vault = await repository.create(new Author("user-1"), "my-vault")

		assert.equal(vault.id.value, "VID-1")
		assert.equal(vault.name, "my-vault")
		assert.deepStrictEqual(vault.secrets(), [])
		assert.deepStrictEqual(new InMemoryRepository([vault]), repository)
	})

	it("must update a vault", async () => {
		const repository = new InMemoryRepository([])
		let vault = await repository.create(new Author("user-1"), "my-vault")

		const secret = SecretEntry.create(new Author("user-1"), 1677910538, "my-secret-entry", "my-secret-value")
		vault = vault.put(secret)

		await repository.update(vault)

		assert.equal(vault.id.value, "VID-1")
		assert.equal(vault.name, "my-vault")
		assert.deepStrictEqual(new InMemoryRepository([vault]), repository)
	})

	it("must update a vault among other vaults", async () => {
		const repository = new InMemoryRepository([])
		const professionalVault = await repository.create(new Author("user-1"), "pro-vault")

		let personalVault = await repository.create(new Author("user-1"), "my-vault")
		const secret = SecretEntry.create(new Author("user-1"), 1677910538, "my-secret-entry", "my-secret-value")
		personalVault = personalVault.put(secret)

		await repository.update(personalVault)

		assert.equal(personalVault.id.value, "VID-2")
		assert.equal(personalVault.name, "my-vault")
		assert.deepStrictEqual(new InMemoryRepository([professionalVault, personalVault]), repository)
	})

	it("must fail to update vault not found", async () => {
		const repository = new InMemoryRepository([])
		const vault = new Vault(new VaultId("bad-ID"), new Author("user-1"), "pro-vault", [])

		const failed = await repository
			.update(vault)
			.then(() => false)
			.catch((error) => error instanceof VaultNotFoundError)

		assert.equal(failed, true)
	})

	it("must find by account", async (): Promise<void> => {
		const repository = new InMemoryRepository([])

		const professionalAccountId = new Author("user-1")
		await repository.create(professionalAccountId, "pro-vault")

		const personalAccountId = new Author("user-2")
		const personalVault = await repository.create(personalAccountId, "my-vault")

		const result = await repository.findByAccount(personalAccountId)

		assert.deepStrictEqual(result, [personalVault.id])
	})
})
