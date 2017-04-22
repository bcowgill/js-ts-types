// shorteners.ts
// Facade for the string shortening classes

import ShortenClass from './shorten'
import ShortenLeftClass from './shorten-left'
import ShortenMiddleClass from './shorten-middle'

export const Shorten = ShortenClass
export const ShortenLeft = ShortenLeftClass
export const ShortenMiddle = ShortenMiddleClass

export default {
	Shorten, ShortenLeft, ShortenMiddle
}
