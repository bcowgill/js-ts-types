// shorten-left.ts
// Shorten a string by cutting out the beginning of it
import { IShortenString } from './ishorten'

const DEF_ELLIPSIS = '…'
const MAX_VALUE_LENGTH = 128

export class ShortenLeft /* extends IShortenStringStatic */ implements IShortenString
{
	private constructor(
		public readonly MAX_LENGTH : number = MAX_VALUE_LENGTH
		, public readonly ELLIPSIS : string = DEF_ELLIPSIS)
	{ /* super(MAX_LENGTH, ELLIPSIS) */}

	static of(length? : number, ellipsis? : string)
	{
		return new ShortenLeft(length, ellipsis)
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
			const length_diff : number = length - ellipsis.length
			shortened = ellipsis + string.substr(-length_diff)
		}

		return shortened
	}
}

export default ShortenLeft
