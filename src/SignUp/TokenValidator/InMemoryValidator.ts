import type { SignUpTokenValidator } from "../SignUpTokenValidator"
import type { SignUpInput } from "../SignUpInput"
import { BadSignUpInputError } from "../Error/BadSignUpInputError"

export class InMemoryValidator implements SignUpTokenValidator {
	constructor(private readonly email: string, private readonly token: string) {}

	async validate(input: SignUpInput): Promise<void> {
		input.email === this.email && input.token === this.token
			? await Promise.resolve()
			: await Promise.reject(new BadSignUpInputError())
	}
}
