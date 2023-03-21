import assert from "assert"
import "mocha"
import { SecretEntry } from "./SecretEntry"
import { Revision } from "./SecretEntry/Revision"
import { Author } from "../Author"

describe("SecretEntry", (): void => {
	const name = "some secret"
	const createdAt = 1677630901
	const initialAuthor = new Author("user-1")
	const anotherAuthor = new Author("user-2")
	const initialEntry = new SecretEntry(initialAuthor, name, createdAt, "initial-value", [], null)

	it("it must be created with given values", () => {
		assert.equal(initialEntry.name, name)
		assert.equal(initialEntry.author, initialAuthor)
		assert.equal(initialEntry.createdAt, createdAt)
		assert.equal(initialEntry.value, "initial-value")
		assert.equal(initialEntry.archivedAt, null)
	})

	it("it must be updated with given value and add a revision with previous value", (): void => {
		const updatedAt = 1677630902
		const updated = initialEntry.update("updated-value", updatedAt, anotherAuthor)

		assert.equal(updated.name, name)
		assert.equal(updated.author, anotherAuthor)
		assert.equal(updated.createdAt, updatedAt)
		assert.equal(updated.value, "updated-value")
		assert.equal(updated.archivedAt, null)
		assert.deepStrictEqual(updated.revisions(), [new Revision(createdAt, "initial-value", initialAuthor)])
	})

	it("it must be archived at given timestamp", (): void => {
		const archivedAt = 1677630902
		const archived = initialEntry.archive(archivedAt, anotherAuthor)

		assert.equal(archived.name, name)
		assert.equal(archived.author, anotherAuthor)
		assert.equal(archived.createdAt, createdAt)
		assert.equal(archived.value, "initial-value")
		assert.equal(archived.archivedAt, archivedAt)
		assert.deepStrictEqual(archived.revisions(), [])
	})

	it("it must be archived with a revision", (): void => {
		const updatedAt = 1677630902
		const updated = initialEntry.update("updated-value", updatedAt, anotherAuthor)

		const archivedAt = 1677630903
		const archivedBy = new Author("user-3")
		const archived = updated.archive(archivedAt, archivedBy)

		assert.equal(archived.name, name)
		assert.equal(archived.author, archivedBy)
		assert.equal(archived.createdAt, updatedAt)
		assert.equal(archived.value, "updated-value")
		assert.equal(archived.archivedAt, archivedAt)
		assert.deepStrictEqual(archived.revisions(), [
			new Revision(initialEntry.createdAt, initialEntry.value, initialAuthor),
		])
	})
})
