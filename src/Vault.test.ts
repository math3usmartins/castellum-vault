import assert from "assert"
import "mocha"
import { SecretEntry } from "./Vault/SecretEntry"
import { Vault } from "./Vault"
import { VaultId } from "./Vault/VaultId"
import { Author } from "./Author"
import { VaultName } from "./Vault/VaultName"

describe("Vault", (): void => {
	const owner = new Author("user-1")
	const vaultId = new VaultId("VID-1")
	const initialEntryName = "some secret"
	const initialEntryCreatedAt = 1677630901
	const initialEntry = new SecretEntry(owner, initialEntryName, initialEntryCreatedAt, "initial-value", [], null)

	const anotherAuthor = new Author("user-2")
	const anotherEntry = new SecretEntry(anotherAuthor, "another secret", 1677630902, "another-value", [], null)

	it("it must be created without secrets", (): void => {
		const vault = new Vault(vaultId, owner, new VaultName("my-vault"), [])

		assert.equal(vault.id.value, "VID-1")
		assert.equal(vault.name.value, "my-vault")
		assert.deepStrictEqual(vault.secrets(), [])
	})

	it("it must be created with given secret", (): void => {
		const vault = new Vault(vaultId, owner, new VaultName("my-vault"), [initialEntry])

		assert.equal(vault.id.value, "VID-1")
		assert.equal(vault.name.value, "my-vault")
		assert.deepStrictEqual(vault.secrets(), [initialEntry])
	})

	it("it must update secret", () => {
		const vault = new Vault(vaultId, owner, new VaultName("my-vault"), [initialEntry, anotherEntry])
		const updatedAt = 1677630902

		const updatedEntry = initialEntry.update("updated-value", updatedAt, anotherAuthor)

		const updatedVault = vault.put(updatedEntry)

		assert.equal(updatedVault.id.value, "VID-1")
		assert.equal(updatedVault.name.value, "my-vault")
		assert.equal(updatedVault.owner, owner)
		assert.deepStrictEqual(updatedVault.secrets(), [updatedEntry, anotherEntry])
	})

	it("it must add new secret", (): void => {
		const vault = new Vault(vaultId, owner, new VaultName("my-vault"), [initialEntry])
		const updatedVault = vault.put(anotherEntry)

		assert.equal(updatedVault.id.value, "VID-1")
		assert.equal(updatedVault.name.value, "my-vault")
		assert.deepStrictEqual(updatedVault.secrets(), [initialEntry, anotherEntry])
	})

	it("it must archive secret", (): void => {
		const vault = new Vault(vaultId, owner, new VaultName("my-vault"), [initialEntry, anotherEntry])
		const archivedAt = 1677630902

		const updatedVault = vault.archive(initialEntryName, archivedAt, anotherAuthor)

		assert.equal(updatedVault.id.value, "VID-1")
		assert.equal(updatedVault.name.value, "my-vault")
		assert.equal(updatedVault.owner, owner)
		assert.deepStrictEqual(updatedVault.secrets(), [initialEntry.archive(archivedAt, anotherAuthor), anotherEntry])
	})
})
