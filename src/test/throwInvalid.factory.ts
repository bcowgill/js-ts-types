import { throwInvalid, TypeErrorInfo } from '../throwInvalid'

const ThrowInvalidFactory =
{
	Type: throwInvalid,

	callThrowInvalid: function (params : TypeErrorInfo) // : MUSTDO type spec
	{
		return function ()
		{
			return throwInvalid(params)
		}
	}
}

export default ThrowInvalidFactory
