import type { Seed } from "./Seed"

export class SeedCollection {
	private items: Seed[] = []

	public firstIfAny(): Seed | null {
		const item = this.items.find((i) => i)

		return item !== undefined ? item : null
	}

	public static with(items: Seed[]): SeedCollection {
		return items.reduce((collection: SeedCollection, item: Seed) => collection.add(item), new SeedCollection())
	}

	public add(seed: Seed): SeedCollection {
		const items = [...this.items.filter((item) => item.value !== seed.value), seed]

		const collection = new SeedCollection()
		collection.items = items

		if (seed.isActive()) {
			return collection.activate(seed)
		}

		return collection
	}

	private activate(seed: Seed): SeedCollection {
		const items: Seed[] = this.items.map((item: Seed) => {
			if (item.value === seed.value) {
				return item.active()
			}

			return item.inactive()
		})

		const collection = new SeedCollection()
		collection.items = items

		return collection
	}

	public getActive(): Seed | null {
		for (const item of this.items) {
			if (item.isActive()) {
				return item
			}
		}

		return null
	}
}
