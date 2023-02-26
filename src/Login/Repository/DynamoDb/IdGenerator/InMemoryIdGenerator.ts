import type { IdGenerator } from "../IdGenerator"

export class InMemoryIdGenerator implements IdGenerator {
	constructor(private values: string[]) {}

	generate(): Promise<string> {
		const nextId = this.values.find((_value: string) => true)

		if (nextId === undefined) {
			return Promise.reject()
		}

		this.values = this.values.slice(1)

		return Promise.resolve(nextId)
	}
}
