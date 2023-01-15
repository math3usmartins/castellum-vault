export class Seed {
	private _isActive = false

	constructor(readonly value: string) {}

	public active(): Seed {
		const seed = new Seed(this.value)
		seed._isActive = true

		return seed
	}

	public inactive(): Seed {
		const seed = new Seed(this.value)
		seed._isActive = false

		return seed
	}

	public isActive(): boolean {
		return this._isActive
	}
}
