import shorten from './string/shorten'

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
	params.prop = params.prop || 'value'
	params.name = params.name || params.prop
	params.description = (params.prop === params.name)
		? `${params.prop} provided <${typeof(params.value)}:${shorten(params.value)}> ${params.reason}`
		: `${params.name} provided <${shorten(params.value)}> ${params.reason}`
	throw new Error(params.description)
}

export default throwInvalid
