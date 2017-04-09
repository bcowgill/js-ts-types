import { throwInvalid } from '../throwInvalid'

// MUSTDO move declaration to a common place
export interface TypeChecker<type>
{
	(value : any, prop? : string, name? : string) : type | never
}

export function aBoolean (
	value : any,
	prop? : string,
	name? : string) : boolean | never
{
	return ('boolean' === typeof(value)) ? value : throwInvalid({
		type: 'boolean',
		reason: 'is not a boolean value',
		value, prop, name
	});
}

export default aBoolean
