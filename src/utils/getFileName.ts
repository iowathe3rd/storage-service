export const splitFileName = (fileName: string) =>{
	const lastDotIndex = fileName.lastIndexOf(".");
	if (lastDotIndex === -1) {
		return { fileNameWithoutExtension: fileName, extension: "" };
	} else {
		const fileNameWithoutExtension = fileName.substring(0, lastDotIndex);
		const extension = fileName.substring(lastDotIndex + 1);
		return { fileNameWithoutExtension, extension };
	}
}