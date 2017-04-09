import 'mocha'
import { expect } from 'chai'
import {
	suite, test
	/* slow, timeout, skip, only */
} from 'mocha-typescript'

import shorten from './shorten'

const ELLIPSIS = '…' // MUSTDO use shorten.ELLIPSIS property
const LONG = '01234567890123456789012345678901234567890123456789012345678901234567890f'

@suite class ShortenTestSuite
{
	@test 'shorten() a short string should leave as is'()
	{
		  const result = shorten('something short enough')
		  expect(result).to.be.equal('something short enough')
	}

	@test 'shorten() a long string should default to 128 chars'()
	{
		  const testMe = 'something too too long' + LONG + LONG
		  const result = shorten(testMe)

		  expect(testMe.length).to.be.greaterThan(128)
		  expect(result.length).to.be.equal(128)
	}

	@test 'shorten() a string with an even custom max length should vary half sizes'()
	{
		  const testMe = 'something too too long'
		  const length = 10
		  const result = shorten(testMe, length)

		  expect(testMe.length).to.be.greaterThan(length)
		  expect(result).to.be.equal('somet' + ELLIPSIS + 'long')
		  expect(result.length).to.be.equal(length)
	}

	@test 'shorten() a string with an odd custom max length should have equal half sizes'()
	{
		  const testMe = 'something too too long'
		  const length = 11
		  const result = shorten(testMe, length)

		  expect(testMe.length).to.be.greaterThan(length)
		  expect(result).to.be.equal('somet' + ELLIPSIS + ' long')
		  expect(result.length).to.be.equal(length)
	}
}

void ShortenTestSuite
