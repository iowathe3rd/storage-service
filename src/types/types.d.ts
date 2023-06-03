export type LoginEvents = "login" | "signup" | "verify"

export enum Roles {
	AUTHENTICATED = "authenticated"
}
export interface UserWebhookData {
	id: string,
	aud: string,
	role: Roles,
	email: string,
	email_confirmed_at: string,
	phone: string,
	app_metadata: object,
	user_metadata: {
		plan?: string,
	},
	identities: [
		{
			id: string,
			user_id: string,
			identity_data: Array<object>,
			provider: "email" | "phone",
			last_sign_in_at: string,
			created_at: string,
			updated_at: string,
		}
	],
	created_at: string,
	updated_at: string,
}
export type GoTrueWebhookData = {
	event: LoginEvents,
	instance_id: string,
	user: UserWebhookData,
}