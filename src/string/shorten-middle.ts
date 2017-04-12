// shorten-middle.ts
// Shorten a string by cutting out the middle

const START = 0
const DEF_ELLIPSIS = '…'
const MAX_VALUE_LENGTH = 128

export class ShortenMiddle
{
	private constructor(
		public readonly MAX_LENGTH : number = MAX_VALUE_LENGTH
		, public readonly ELLIPSIS : string = DEF_ELLIPSIS)
	{}

	static of(length?: number, ellipsis?: string)
	{
		return new ShortenMiddle(length, ellipsis)
	}

	shorten (
		string : string,
		length : number = this.MAX_LENGTH
	) : string
	{
		let shortened = string

		if (string.length > length)
		{
			const first_half = Math.floor(length / 2)
			const last_half = -first_half + odd(length)
			shortened = string.substr(START, first_half)
				+ this.ELLIPSIS
				+ string.substr(last_half)
		}

		return shortened
	}
}

function odd(value : number) : number
{
	return 1 - (Math.floor(value) % 2)
}

export default ShortenMiddle
