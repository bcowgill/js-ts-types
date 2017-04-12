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
			const length_diff = length - this.ELLIPSIS.length + 1
			let first_half = Math.floor(length_diff / 2)
			let last_half = first_half - odd(length_diff)
			if (last_half > first_half)
			{
				let temp = last_half
				last_half = first_half
				first_half = temp
			}
			shortened = string.substr(START, first_half)
				+ this.ELLIPSIS
				+ string.substr(-last_half)
		}

		return shortened
	}
}

function odd(value : number) : number
{
	return 1 - (Math.floor(value) % 2)
}

export default ShortenMiddle
