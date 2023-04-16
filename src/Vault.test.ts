import assert from "assert"
import "mocha"
import { SecretEntry } from "./Vault/SecretEntry"
import { Vault } from "./Vault"
import { VaultId } from "./Vault/VaultId"
import { Author } from "./Author"
import { VaultName } from "./Vault/VaultName"
import { WebLoginSecret } from "./Vault/SecretEntry/SecretValue/WebLoginSecret"

describe("Vault", (): void => {
	const owner = new Author("user-1")
	const vaultId = new VaultId("VID-1")
	const initialEntryName = "some secret"
	const initialEntryCreatedAt = 1677630901
	const initialValue = new WebLoginSecret("initial url", "initial username", "initial value", "initial notes")
	const initialEntry = SecretEntry.create(initialEntryName, owner, initialEntryCreatedAt, initialValue)

	const anotherAuthor = new Author("user-2")
	const updatedValue = new WebLoginSecret("updated url", "updated username", "updated value", "updated notes")
	const anotherEntry = SecretEntry.create("another secret", anotherAuthor, 1677630902, updatedValue)

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

	it("it must throw error when entry not found", (): void => {
		const vault = new Vault(vaultId, owner, new VaultName("my-vault"), [])

		assert.throws(() => {
			vault.getByName("bad-name")
		}, new Error('No entry found with name "bad-name"'))
	})

	it("it must get entry by name", (): void => {
		const vault = new Vault(vaultId, owner, new VaultName("my-vault"), [initialEntry, anotherEntry])
		const entry = vault.getByName(anotherEntry.name)

		assert.deepStrictEqual(entry, anotherEntry)
	})

	it("it must update secret", () => {
		const vault = new Vault(vaultId, owner, new VaultName("my-vault"), [initialEntry, anotherEntry])
		const updatedAt = 1677630902
		const updatedEntry = initialEntry.update(updatedValue, updatedAt, anotherAuthor)

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
		assert.deepStrictEqual(updatedVault.secrets(), [updatedVault.getByName(initialEntryName), anotherEntry])

		assert.equal(updatedVault.getByName(initialEntryName).current().archived, true)
	})
})
