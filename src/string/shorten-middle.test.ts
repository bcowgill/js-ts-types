import 'mocha'
import { expect } from 'chai'

import ShortenMiddle from './shorten-middle'

const ELLIPSIS = '…'
const LONG = '01234567890123456789012345678901234567890123456789012345678901234567890f'

describe('ShortenMiddle', function () {
	describe('constructor()', function () {
		it('should use default properties', function ()
		{
			  const testMe = ShortenMiddle.of()
			  expect(testMe.ELLIPSIS).to.be.equal(ELLIPSIS)
			  expect(testMe.MAX_LENGTH).to.be.equal(128)
		})

		it('should override default properties', function ()
		{
			  const testMe = ShortenMiddle.of(13, '...')
			  expect(testMe.ELLIPSIS).to.be.equal('...')
			  expect(testMe.MAX_LENGTH).to.be.equal(13)
		})

		it('of() should construct', function ()
		{
			  const testMe = ShortenMiddle.of(13, '...')
			  expect(testMe.ELLIPSIS).to.be.equal('...')
			  expect(testMe.MAX_LENGTH).to.be.equal(13)
		})
	})

	describe('shorten()', function () {
		it('should leave a short string as is', function ()
		{
			  const testMe = ShortenMiddle.of()
			  const result = testMe.shorten('something short enough')
			  expect(result).to.be.equal('something short enough')
		})

		it('should shorten a long string to default 128', function ()
		{
			const testMe = ShortenMiddle.of()
			const input = 'something too too long' + LONG + LONG
			const result = testMe.shorten(input)
			expect(input.length).to.be.greaterThan(128)
			expect(result.length).to.be.equal(128)
		})

		it('should shorten with an even custom max length and vary half sizes', function ()
		{
			const length = 10
			const testMe = ShortenMiddle.of(length)
			const input = 'something too too long'
			const result = testMe.shorten(input)

			expect(input.length).to.be.greaterThan(length)
			expect(result).to.be.equal('somet' + ELLIPSIS + 'long')
			expect(result.length).to.be.equal(length)
		})

		it('should shorten with an odd custom max length and equal half sizes', function ()
		{
			const length = 11
			const testMe = ShortenMiddle.of()
			const input = 'something too too long'
			const result = testMe.shorten(input, length)

			expect(input.length).to.be.greaterThan(length)
			expect(result).to.be.equal('somet' + ELLIPSIS + ' long')
			expect(result.length).to.be.equal(length)
		})
	})

	describe('shorten( ... )', function () {

		it('should shorten with a string of characters to default length', function ()
		{
			const testMe = ShortenMiddle.of(void 0, ' ... ')
			const input = 'something too too long' + LONG + LONG
			const result = testMe.shorten(input)
			expect(input.length).to.be.greaterThan(128)
			expect(result.length).to.be.equal(128)
		})

		it('should shorten with an odd string of characters to even length', function ()
		{
			const length = 10
			const testMe = ShortenMiddle.of(length, ' ... ')
			const input = 'something too too long'
			const result = testMe.shorten(input)

			expect(input.length).to.be.greaterThan(length)
			expect(result).to.be.equal('som ... ng')
			expect(result.length).to.be.equal(length)
		})

		it('should shorten with an even string of characters to odd length', function ()
		{
			const length = 11
			const testMe = ShortenMiddle.of(length, ' .. ')
			const input = 'something too too long'
			const result = testMe.shorten(input)

			expect(input.length).to.be.greaterThan(length)
			expect(result).to.be.equal('some .. ong')
			expect(result.length).to.be.equal(length)
		})

		it('should shorten with an odd string of characters to even length', function ()
		{
			const length = 10
			const testMe = ShortenMiddle.of(length, ' .. ')
			const input = 'something too too long'
			const result = testMe.shorten(input)

			expect(input.length).to.be.greaterThan(length)
			expect(result).to.be.equal('som .. ong')
			expect(result.length).to.be.equal(length)
		})

		it('should shorten with an even string of characters to odd length', function ()
		{
			const length = 11
			const testMe = ShortenMiddle.of(length, ' ... ')
			const input = 'something too too long'
			const result = testMe.shorten(input)

			expect(input.length).to.be.greaterThan(length)
			expect(result).to.be.equal('som ... ong')
			expect(result.length).to.be.equal(length)
		})

		it('should shorten with a string of characters longer than the limit', function ()
		{
			const length = 3
			const testMe = ShortenMiddle.of(length, ' ... ')
			const input = 'something too too long'
			const result = testMe.shorten(input)

			expect(input.length).to.be.greaterThan(length)
			expect(result).to.be.equal('sog')
			expect(result.length).to.be.equal(length)
		})
	})

	describe('shorten("")', function () {
		it('should shorten with empty string to default length', function ()
		{
			const testMe = ShortenMiddle.of(void 0, '')
			const input = 'something too too long' + LONG + LONG
			const result = testMe.shorten(input)
			expect(input.length).to.be.greaterThan(128)
			expect(result.length).to.be.equal(128)
		})


		it('should shorten with empty string to even length', function ()
		{
			const length = 10
			const testMe = ShortenMiddle.of(length, '')
			const input = 'something too too long'
			const result = testMe.shorten(input)

			expect(input.length).to.be.greaterThan(length)
			expect(result).to.be.equal('somet long')
			expect(result.length).to.be.equal(length)
		})

		it('should shorten with empty string to odd length', function ()
		{
			const length = 11
			const testMe = ShortenMiddle.of(length, '')
			const input = 'something too too long'
			const result = testMe.shorten(input)

			expect(input.length).to.be.greaterThan(length)
			expect(result).to.be.equal('someth long')
			expect(result.length).to.be.equal(length)
		})
	})
})
