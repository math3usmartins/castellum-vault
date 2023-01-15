import type { LoginValidator } from "../LoginValidator"
import type { LoginInput } from "../LoginInput"
import { BadLoginInput } from "./Error/BadLoginInput"

export class InMemoryValidator implements LoginValidator {
	constructor(private readonly email: string, private readonly token: string, private readonly mfaCode: string) {}

	async validate(input: LoginInput): Promise<void> {
		input.email === this.email && input.token === this.token && input.mfaCode === this.mfaCode
			? await Promise.resolve()
			: await Promise.reject(new BadLoginInput())
	}
}
