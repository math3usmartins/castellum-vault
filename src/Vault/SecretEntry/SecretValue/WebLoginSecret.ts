import type { SecretValue } from "../SecretValue"

export class WebLoginSecret implements SecretValue {
	public static TYPE_NAME = "castellum.web-login"

	constructor(
		public readonly url: string,
		public readonly username: string,
		public readonly password: string,
		public readonly note: string,
	) {}

	public typeName = (): string => WebLoginSecret.TYPE_NAME
}
