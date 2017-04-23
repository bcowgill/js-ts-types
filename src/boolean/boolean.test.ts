import 'mocha'
import { expect } from 'chai'
import {
	suite, test
	/* slow, timeout, skip, only */
} from 'mocha-typescript'

import aBoolean from './boolean'

@suite class BooleanTestSuite
{
	@test 'aBoolean(boolean) should return boolean value'()
	{
		expect(testIt(true)()).to.equal(true)
	}

	@test 'aBoolean(non-boolean) should throw an error'()
	{
		expect(testIt('not boolean')).to.throw(Error)
	}

	@test 'aBoolean(with prop, name) should throw an error with the name'()
	{
		expect(testIt('not boolean', 'theprop', 'thename'))
			.to.throw(/thename/)
	}
}

function testIt (value: any, prop? : string, name? : string) : () => boolean | never
{
	return function ()
	{
		return aBoolean(value, prop, name)
	}
}

void BooleanTestSuite //tslint:disable-line:no-unused-expression
