import assert from "assert"
import "mocha"
import { SecretEntry } from "./SecretEntry"
import { Revision } from "./SecretEntry/Revision"
import { Author } from "../Author"
import { WebLoginSecret } from "./SecretEntry/SecretValue/WebLoginSecret"
import { NoteSecret } from "./SecretEntry/SecretValue/NoteSecret"

describe("SecretEntry", (): void => {
	const name = "some secret"
	const createdAt = 1677630901
	const initialAuthor = new Author("user-1")
	const anotherAuthor = new Author("user-2")
	const initialWebLoginValue = new WebLoginSecret("initial url", "initial username", "initial value", "initial notes")
	const initialWebLoginEntry = new SecretEntry(initialAuthor, name, createdAt, initialWebLoginValue, [], null)
	const updatedWebLoginValue = new WebLoginSecret("updated url", "updated username", "updated value", "updated notes")

	it("web login must be created with given values", () => {
		assert.equal(initialWebLoginEntry.name, name)
		assert.equal(initialWebLoginEntry.author, initialAuthor)
		assert.equal(initialWebLoginEntry.createdAt, createdAt)
		assert.equal(initialWebLoginEntry.value, initialWebLoginValue)
		assert.equal(initialWebLoginEntry.value.typeName(), "castellum.web-login")
		assert.equal(initialWebLoginEntry.archivedAt, null)
	})
	it("secret note must be created with given values", () => {
		const initialNoteValue = new NoteSecret("my secret note")
		const initialEntry = new SecretEntry(initialAuthor, name, createdAt, initialNoteValue, [], null)

		assert.equal(initialEntry.name, name)
		assert.equal(initialEntry.author, initialAuthor)
		assert.equal(initialEntry.createdAt, createdAt)
		assert.equal(initialEntry.value, initialNoteValue)
		assert.equal(initialEntry.value.typeName(), "castellum.note")
		assert.equal(initialEntry.archivedAt, null)
	})

	it("it must be updated with given value and add a revision with previous value", (): void => {
		const updatedAt = 1677630902
		const updated = initialWebLoginEntry.update(updatedWebLoginValue, updatedAt, anotherAuthor)

		assert.equal(updated.name, name)
		assert.equal(updated.author, anotherAuthor)
		assert.equal(updated.createdAt, updatedAt)
		assert.equal(updated.value, updatedWebLoginValue)
		assert.equal(updated.archivedAt, null)

		assert.deepStrictEqual(updated.revisions(), [new Revision(createdAt, initialWebLoginValue, initialAuthor)])

		const revision = updated.revisions()[0]

		if (revision === undefined) {
			assert.fail("Failed to get revision")
		} else {
			assert.equal(revision.createdAt, createdAt)
			assert.equal(revision.value, initialWebLoginValue)
			assert.deepStrictEqual(revision.author, initialAuthor)
		}
	})

	it("it must be archived at given timestamp", (): void => {
		const archivedAt = 1677630902
		const archived = initialWebLoginEntry.archive(archivedAt, anotherAuthor)

		assert.equal(archived.name, name)
		assert.equal(archived.author, anotherAuthor)
		assert.equal(archived.createdAt, createdAt)
		assert.equal(archived.value, initialWebLoginValue)
		assert.equal(archived.archivedAt, archivedAt)
		assert.deepStrictEqual(archived.revisions(), [])
	})

	it("it must be archived with a revision", (): void => {
		const updatedAt = 1677630902
		const updated = initialWebLoginEntry.update(updatedWebLoginValue, updatedAt, anotherAuthor)

		const archivedAt = 1677630903
		const archivedBy = new Author("user-3")
		const archived = updated.archive(archivedAt, archivedBy)

		assert.equal(archived.name, name)
		assert.equal(archived.author, archivedBy)
		assert.equal(archived.createdAt, updatedAt)
		assert.equal(archived.value, updatedWebLoginValue)
		assert.equal(archived.archivedAt, archivedAt)
		assert.deepStrictEqual(archived.revisions(), [
			new Revision(initialWebLoginEntry.createdAt, initialWebLoginEntry.value, initialAuthor),
		])
	})
})
