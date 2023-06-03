import { GoTrueClient } from '@supabase/gotrue-js';
import * as process from 'process';
import { ForbiddenException } from '@nestjs/common';
import { User } from '@supabase/gotrue-js';

const goTrueURL = process.env.KONG_URL + '/api/v1';
export const authClient = new GoTrueClient({ url: goTrueURL });

export async function authenticate(jwt: string): Promise<{ user: User }> {
	const { data, error } = await authClient.getUser(jwt);
	if (error instanceof Error) {
		throw new ForbiddenException({ message: 'not authenticated' + error });
	}
	return data;
}
