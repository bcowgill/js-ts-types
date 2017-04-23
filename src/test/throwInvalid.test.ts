import 'mocha'
import { expect } from 'chai'
import {
	suite, test
	/* slow, timeout, skip, only */
} from 'mocha-typescript'

import ThrowInvalidFactory from './throwInvalid.factory'

const testIt = ThrowInvalidFactory.callThrowInvalid

@suite class ThrowInvalidTestSuite
{
	@test 'throwInvalid() should throw an error'()
	{
		expect(testIt({
				type: 'test',
				value: null,
				reason: 'reason'
			})).to.throw(Error)
	}

	@test 'throwInvalid() should have simplest message'()
	{
		expect(testIt({
				type: 'thetype',
				value: 'thevalue',
				reason: 'thereason'
			})).to.throw(/^value provided <string:thevalue> thereason/)
	}

	@test 'throwInvalid() should have property name in message'()
	{
		expect(testIt({
				type: 'thetype',
				value: 'thevalue',
				prop: 'theproperty',
				reason: 'thereason'
			})).to.throw(/^theproperty provided <string:thevalue> thereason/)
	}

	@test 'throwInvalid() should have nice name in the message if no property name'()
	{
		expect(testIt({
				type: 'thetype',
				value: 'thevalue',
				name: 'Nice UI Name',
				reason: 'thereason'
			})).to.throw(/^Nice UI Name provided <thevalue> thereason/)
	}

	@test 'throwInvalid() should have nice name in the message'()
	{
		expect(testIt({
				type: 'thetype',
				value: 'thevalue',
				prop: 'theproperty',
				name: 'Nice UI Name',
				reason: 'thereason'
			})).to.throw(/^Nice UI Name provided <thevalue> thereason/)
	}
}

void ThrowInvalidTestSuite //tslint:disable-line:no-unused-expression
