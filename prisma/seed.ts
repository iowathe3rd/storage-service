import { db } from '../src/libs/prisma';

async function seed() {
	await db.owner.create({
		data: {
			id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
			email: "iowathe3rd@proton.me",
			storageLevel: "Enterprise"
		}
	})
}

seed();