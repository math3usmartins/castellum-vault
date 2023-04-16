import assert from "assert"
import "mocha"
import { SecretEntry } from "./SecretEntry"
import { Author } from "../Author"
import { WebLoginSecret } from "./SecretEntry/SecretValue/WebLoginSecret"
import { NoteSecret } from "./SecretEntry/SecretValue/NoteSecret"

describe("SecretEntry", (): void => {
	const name = "some secret"
	const createdAt = 1677630901
	const initialAuthor = new Author("user-1")
	const anotherAuthor = new Author("user-2")
	const initialWebLoginValue = new WebLoginSecret("initial url", "initial username", "initial value", "initial notes")
	const initialWebLoginEntry = SecretEntry.create(name, initialAuthor, createdAt, initialWebLoginValue)
	const updatedWebLoginValue = new WebLoginSecret("updated url", "updated username", "updated value", "updated notes")

	it("web login must be created with given values", () => {
		assert.equal(initialWebLoginEntry.name, name)
		assert.equal(initialWebLoginEntry.current().author, initialAuthor)
		assert.equal(initialWebLoginEntry.current().createdAt, createdAt)
		assert.equal(initialWebLoginEntry.current().value, initialWebLoginValue)
		assert.equal(initialWebLoginEntry.current().value.typeName(), "castellum.web-login")
		assert.equal(initialWebLoginEntry.current().archived, false)
		assert.equal(initialWebLoginEntry.revisions().length, 1)
	})

	it("secret note must be created with given values", () => {
		const initialNoteValue = new NoteSecret("my secret note")
		const initialEntry = SecretEntry.create(name, initialAuthor, createdAt, initialNoteValue)

		assert.equal(initialEntry.name, name)
		assert.equal(initialEntry.current().author, initialAuthor)
		assert.equal(initialEntry.current().createdAt, createdAt)
		assert.equal(initialEntry.current().value, initialNoteValue)
		assert.equal(initialEntry.current().value.typeName(), "castellum.note")
		assert.equal(initialEntry.current().archived, false)
		assert.equal(initialEntry.revisions().length, 1)
	})

	it("it must be updated with given value and add a revision with previous value", (): void => {
		const updatedAt = 1677630902
		const initialRevision = initialWebLoginEntry.current()
		const updated = initialWebLoginEntry.update(updatedWebLoginValue, updatedAt, anotherAuthor)

		assert.equal(updated.name, name)
		assert.equal(updated.current().author, anotherAuthor)
		assert.equal(updated.current().createdAt, updatedAt)
		assert.equal(updated.current().value, updatedWebLoginValue)
		assert.equal(updated.current().archived, false)
		assert.deepStrictEqual(updated.revisions(), [initialRevision, updated.current()])
	})

	it("it must merge with different revisions", (): void => {
		const updatedAt = 1677630902
		const initialRevision = initialWebLoginEntry.current()
		const updated = initialWebLoginEntry.update(updatedWebLoginValue, updatedAt, anotherAuthor)
		assert.deepStrictEqual(updated.revisions(), [initialRevision, updated.current()])

		const anotherUpdatedWebLoginValue = new WebLoginSecret(
			"another updated url",
			"another updated username",
			"another updated value",
			"other updated notes",
		)
		const yetAnotherAuthor = new Author("user-3")
		const anotherUpdatedAt = 1677630903
		const anotherUpdated = initialWebLoginEntry.update(
			anotherUpdatedWebLoginValue,
			anotherUpdatedAt,
			yetAnotherAuthor,
		)

		const merged = updated.merge(anotherUpdated)
		assert.deepStrictEqual(merged.current(), anotherUpdated.current())

		assert.equal(merged.name, name)
		assert.equal(merged.current().author, yetAnotherAuthor)
		assert.equal(merged.current().createdAt, anotherUpdatedAt)
		assert.equal(merged.current().value, anotherUpdatedWebLoginValue)
		assert.equal(merged.current().archived, false)
		assert.deepStrictEqual(merged.revisions(), [initialRevision, updated.current(), anotherUpdated.current()])
	})

	it("it must be archived at given timestamp", (): void => {
		const initialRevision = initialWebLoginEntry.current()

		const archivedAt = 1677630902
		const archived = initialWebLoginEntry.archive(archivedAt, anotherAuthor)

		assert.equal(archived.name, name)
		assert.equal(archived.current().author, anotherAuthor)
		assert.equal(archived.current().createdAt, archivedAt)
		assert.equal(archived.current().value, initialWebLoginValue)
		assert.equal(archived.current().archived, true)
		assert.deepStrictEqual(archived.revisions(), [initialRevision, archived.current()])
	})

	it("it must be archived with a revision", (): void => {
		const initialRevision = initialWebLoginEntry.current()

		const updatedAt = 1677630902
		const updated = initialWebLoginEntry.update(updatedWebLoginValue, updatedAt, anotherAuthor)

		const archivedAt = 1677630903
		const archivedBy = new Author("user-3")
		const archived = updated.archive(archivedAt, archivedBy)

		assert.equal(archived.name, name)
		assert.equal(archived.current().author, archivedBy)
		assert.equal(archived.current().createdAt, archivedAt)
		assert.equal(archived.current().value, updatedWebLoginValue)
		assert.equal(archived.current().archived, true)
		assert.deepStrictEqual(archived.revisions(), [initialRevision, updated.current(), archived.current()])
	})
})
