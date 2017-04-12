import ShortenMiddle from './string/shorten-middle'

export interface TypeErrorInfo
{
	type : string,
	value : any,
	reason : string,
	prop? : string,
	name? : string,
	min? : number,
	max? : number,
	description? : string,
}

export interface TypeErrorThrower
{
	(params : TypeErrorInfo) : never
}

export function throwInvalid (params : TypeErrorInfo) : never
{
	const value = ShortenMiddle.of().shorten(params.value)
	params.prop = params.prop || 'value'
	params.name = params.name || params.prop
	params.description = (params.prop === params.name)
		? `${params.prop} provided <${typeof(params.value)}:${value}> ${params.reason}`
		: `${params.name} provided <${value}> ${params.reason}`
	throw new Error(params.description)
}

export default throwInvalid
