import type { SignUpInput } from "./SignUpInput"

export interface SignUpTokenValidator {
	validate: (input: SignUpInput) => Promise<void>
}
