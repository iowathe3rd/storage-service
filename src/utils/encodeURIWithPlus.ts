export function encodeUrlWithPlus(url: string): string {
	return encodeURI(url).replace(/%20/g, '+');
}
