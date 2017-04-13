// shorten-middle.ts
// Shorten a string by cutting out the middle
import { IShortenString } from './ishorten'

const START = 0
const DEF_ELLIPSIS = '…'
const MAX_VALUE_LENGTH = 128

export class ShortenMiddle /* extends IShortenStringStatic */ implements IShortenString
{
	private constructor(
		public readonly MAX_LENGTH : number = MAX_VALUE_LENGTH
		, public readonly ELLIPSIS : string = DEF_ELLIPSIS)
	{ /* super(MAX_LENGTH, ELLIPSIS) */}

	static of(length? : number, ellipsis? : string)
	{
		return new ShortenMiddle(length, ellipsis)
	}

	shorten (
		string : string,
		length : number = this.MAX_LENGTH
	) : string
	{
		let shortened : string = string
		const ellipsis : string = this.ELLIPSIS.length >= length ? '' : this.ELLIPSIS

		if (string.length > length)
		{
			const length_diff : number = length - ellipsis.length + 1
			let first_half : number = Math.floor(length_diff / 2)
			let last_half : number = first_half - _odd(length_diff)
			if (last_half > first_half)
			{
				let temp : number = last_half
				last_half = first_half
				first_half = temp
			}
			shortened = string.substr(START, first_half)
				+ ellipsis
				+ string.substr(-last_half)
		}

		return shortened
	}
}

function _odd(value : number) : number
{
	return 1 - (Math.floor(value) % 2)
}

export default ShortenMiddle
