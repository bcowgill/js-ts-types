
const START = 0
const ELLIPSIS = '…'
const MAX_VALUE_LENGTH = 128

export interface ShortenFn
{
	(string : string, length? : number) : string
	ELLIPSIS: string
	MAX_VALUE_LENGTH: number
}

export const shorten : ShortenFn = function (
	string : string,
	length : number = MAX_VALUE_LENGTH) : string
{
	let shortened = string
	if (string.length > length)
	{
		const first_half = Math.floor(length / 2)
		const last_half = -first_half + odd(length)
		shortened = string.substr(START, first_half)
			+ ELLIPSIS
			+ string.substr(last_half)
	}
	return shortened
}

//shorten.ELLIPSIS = ELLIPSIS
//shorten.MAX_VALUE_LENGTH = MAX_VALUE_LENGTH

function odd(value : number) : number
{
	return 1 - (Math.floor(value) % 2)
}

export default shorten
