import 'mocha'
import { assert } from 'chai'
import {
	suite, test,
	/* slow, timeout, skip, only */
} from 'mocha-typescript'

describe('first test suite', function() {
	describe('.method()', function() {
		// debugger;
		it('should return -1 when the value is not present', function() {
			assert.equal(-1, [1, 2, 3].indexOf(4));
		});

		it('should compare strings', function() {
			assert.deepEqual(
				['The quick brown fox jumped over the lazy dog', 'burma'],
				['Dhe quik fox humpd under the dog', 'shave']);
		});

		it('should handle a pending test');
	});
});

// decorator syntax for test suites
@suite class TestPlan
{
	@test 'example'()
	{
		console.log('in a mocha test')
	}
}

void TestPlan //tslint:disable-line:no-unused-expression
