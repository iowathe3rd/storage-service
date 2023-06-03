import { db } from '../src/libs/prisma';
import { StorageLevels } from '../src/modules/admin-api/dto/user.dto';

async function seed() {
	await db.user.create({
		data: {
			id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
			userId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6f",
			storageLevel: StorageLevels["Enterprise"],
			folders: {
				create: {
					name: "__init",
					fullPath: `9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d/`,
				}
			}
		}
	})
}

seed();