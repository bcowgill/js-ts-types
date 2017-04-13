/*
abstract class IShortenStringStatic
{
	abstract of (length? : number, ellipsis? : string) : IShortenString
}
*/

export interface IShortenString
{
	readonly MAX_LENGTH : number
	readonly ELLIPSIS : string

	shorten (string : string, length? : number) : string
}

