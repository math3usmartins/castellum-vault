import type { SecretValue } from "../SecretValue"

export class NoteSecret implements SecretValue {
	public static TYPE_NAME = "castellum.note"

	constructor(public readonly value: string) {}

	public typeName = (): string => NoteSecret.TYPE_NAME
}
