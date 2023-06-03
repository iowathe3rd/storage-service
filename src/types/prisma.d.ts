import { StorageLevels } from '../dto/user.dto';

export type User = {
	id: string,
	userId: string,
	storageLevel: StorageLevels,
	folders: Folder[]
	files: File[],
	createdAt: Date
}
export type Folder = {
	id: string,
	name: string,
	fullPath: string,
	size: number,
	user: User,
	userId: string,
	parentFolderId: string,
	parentFolder: Folder,
	childFolders: Folder[],
	files: File[],
	createdAt: Date
}

export type File = {
	id: string
	key: string,
	size: number,
	extension: string,
	originalName: string,
	folder: Folder,
	folderId: string,
	user: User,
	userId: string,
	createdAt: Date
}