// shorten.ts
// Shorten a string by cutting out the end of it
import { IShortenString } from './ishorten'

const START = 0
const DEF_ELLIPSIS = '…'
const MAX_VALUE_LENGTH = 128

export class Shorten /* extends IShortenStringStatic */ implements IShortenString
{
	private constructor(
		public readonly MAX_LENGTH : number = MAX_VALUE_LENGTH
		, public readonly ELLIPSIS : string = DEF_ELLIPSIS)
	{ /* super(MAX_LENGTH, ELLIPSIS) */}

	static of(length? : number, ellipsis? : string)
	{
		return new Shorten(length, ellipsis)
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
			const lengthDiff : number = length - ellipsis.length
			shortened = string.substr(START, lengthDiff) + ellipsis
		}

		return shortened
	}
}

export default Shorten
