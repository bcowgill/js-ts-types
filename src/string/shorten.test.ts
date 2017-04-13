import 'mocha'
import { expect } from 'chai'

import Shorteners from './shorteners'
const Shorten = Shorteners.Shorten

const ELLIPSIS = '…'
const LONG = '01234567890123456789012345678901234567890123456789012345678901234567890f'

describe('Shorteners', function () {
	it('should have access to Shorten class', function ()
	{
		  expect(Shorteners.Shorten).to.exist
	})

	it('should have access to ShortenLeft class', function ()
	{
		  expect(Shorteners.ShortenLeft).to.exist
	})

	it('should have access to ShortenMiddle class', function ()
	{
		  expect(Shorteners.ShortenMiddle).to.exist
	})
})

describe('Shorten', function () {
	describe('constructor()', function () {
		it('should use default properties', function ()
		{
			  const testMe = Shorten.of()
			  expect(testMe.ELLIPSIS).to.be.equal(ELLIPSIS)
			  expect(testMe.MAX_LENGTH).to.be.equal(128)
		})

		it('should override default properties', function ()
		{
			  const testMe = Shorten.of(13, '...')
			  expect(testMe.ELLIPSIS).to.be.equal('...')
			  expect(testMe.MAX_LENGTH).to.be.equal(13)
		})

		it('of() should construct', function ()
		{
			  const testMe = Shorten.of(13, '...')
			  expect(testMe.ELLIPSIS).to.be.equal('...')
			  expect(testMe.MAX_LENGTH).to.be.equal(13)
		})
	})

	describe('shorten()', function () {
		it('should leave a short string as is', function ()
		{
			  const testMe = Shorten.of()
			  const result = testMe.shorten('something short enough')
			  expect(result).to.be.equal('something short enough')
		})

		it('should shorten a long string to default 128', function ()
		{
			const testMe = Shorten.of()
			const input = 'something too too long' + LONG + LONG
			const result = testMe.shorten(input)
			expect(input.length).to.be.greaterThan(128)
			expect(result.length).to.be.equal(128)
		})

		it('should shorten with an even custom max length', function ()
		{
			const length = 10
			const testMe = Shorten.of(length)
			const input = 'something too too long'
			const result = testMe.shorten(input)

			expect(input.length).to.be.greaterThan(length)
			expect(result).to.be.equal('something' + ELLIPSIS)
			expect(result.length).to.be.equal(length)
		})

		it('should shorten with an odd custom max length', function ()
		{
			const length = 11
			const testMe = Shorten.of()
			const input = 'something too too long'
			const result = testMe.shorten(input, length)

			expect(input.length).to.be.greaterThan(length)
			expect(result).to.be.equal('something ' + ELLIPSIS)
			expect(result.length).to.be.equal(length)
		})
	})

	describe('shorten( ... )', function () {

		it('should shorten with a string of characters to default length', function ()
		{
			const testMe = Shorten.of(void 0, ' ... ')
			const input = 'something too too long' + LONG + LONG
			const result = testMe.shorten(input)
			expect(input.length).to.be.greaterThan(128)
			expect(result.length).to.be.equal(128)
		})

		it('should shorten with an odd string of characters to even length', function ()
		{
			const length = 10
			const testMe = Shorten.of(length, ' ... ')
			const input = 'something too too long'
			const result = testMe.shorten(input)

			expect(input.length).to.be.greaterThan(length)
			expect(result).to.be.equal('somet ... ')
			expect(result.length).to.be.equal(length)
		})

		it('should shorten with an even string of characters to odd length', function ()
		{
			const length = 11
			const testMe = Shorten.of(length, ' .. ')
			const input = 'something too too long'
			const result = testMe.shorten(input)

			expect(input.length).to.be.greaterThan(length)
			expect(result).to.be.equal('somethi .. ')
			expect(result.length).to.be.equal(length)
		})

		it('should shorten with an odd string of characters to even length', function ()
		{
			const length = 10
			const testMe = Shorten.of(length, ' .. ')
			const input = 'something too too long'
			const result = testMe.shorten(input)

			expect(input.length).to.be.greaterThan(length)
			expect(result).to.be.equal('someth .. ')
			expect(result.length).to.be.equal(length)
		})

		it('should shorten with an even string of characters to odd length', function ()
		{
			const length = 11
			const testMe = Shorten.of(length, ' ... ')
			const input = 'something too too long'
			const result = testMe.shorten(input)

			expect(input.length).to.be.greaterThan(length)
			expect(result).to.be.equal('someth ... ')
			expect(result.length).to.be.equal(length)
		})

		it('should shorten with a string of characters longer than the limit', function ()
		{
			const length = 3
			const testMe = Shorten.of(length, ' ... ')
			const input = 'something too too long'
			const result = testMe.shorten(input)

			expect(input.length).to.be.greaterThan(length)
			expect(result).to.be.equal('som')
			expect(result.length).to.be.equal(length)
		})
	})

	describe('shorten("")', function () {
		it('should shorten with empty string to default length', function ()
		{
			const testMe = Shorten.of(void 0, '')
			const input = 'something too too long' + LONG + LONG
			const result = testMe.shorten(input)
			expect(input.length).to.be.greaterThan(128)
			expect(result.length).to.be.equal(128)
		})


		it('should shorten with empty string to even length', function ()
		{
			const length = 10
			const testMe = Shorten.of(length, '')
			const input = 'something too too long'
			const result = testMe.shorten(input)

			expect(input.length).to.be.greaterThan(length)
			expect(result).to.be.equal('something ')
			expect(result.length).to.be.equal(length)
		})

		it('should shorten with empty string to odd length', function ()
		{
			const length = 11
			const testMe = Shorten.of(length, '')
			const input = 'something too too long'
			const result = testMe.shorten(input)

			expect(input.length).to.be.greaterThan(length)
			expect(result).to.be.equal('something t')
			expect(result.length).to.be.equal(length)
		})
	})
})
