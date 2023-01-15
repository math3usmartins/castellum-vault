import assert from "assert"
import "mocha"
import { SeedCollection } from "./SeedCollection"
import { Seed } from "./Seed"

describe("ConfigCollection", () => {
	it("must be created without any items", () => {
		const collection = new SeedCollection()

		assert.equal(collection.getActive(), null)
	})

	it("must return first", () => {
		const first = new Seed("seed-123").inactive()
		const second = new Seed("seed-456").inactive()
		const collection = SeedCollection.with([first, second])

		assert.deepStrictEqual(collection.firstIfAny(), first)
	})

	it("must returns null when none found", () => {
		const collection = SeedCollection.with([])

		assert.equal(collection.firstIfAny(), null)
	})

	it("must be created with active item", () => {
		const seed = new Seed("seed-123").active()
		const collection = SeedCollection.with([seed])

		assert.deepStrictEqual(collection.getActive(), seed)
	})

	it("must add inactive item", () => {
		const collection = new SeedCollection().add(new Seed("seed-123"))

		assert.equal(collection.getActive(), null)
	})

	it("must add active item", () => {
		const seed = new Seed("seed-123").active()
		const collection = new SeedCollection().add(seed)

		assert.deepStrictEqual(collection.getActive(), seed)
	})

	it("must add active item and deactivate other ones", () => {
		const collection = SeedCollection.with([new Seed("seed-123").active()])

		const newSeed = new Seed("seed-456").active()

		assert.deepStrictEqual(collection.add(newSeed).getActive(), newSeed)
	})

	it("must overwrite already existing item", () => {
		const collection = SeedCollection.with([new Seed("seed-123").inactive()])

		const newSeed = new Seed("seed-123").active()

		assert.deepStrictEqual(collection.add(newSeed), SeedCollection.with([newSeed]))
	})
})
