import { expect } from 'chai';
import { spec } from '../modules/outconBidAdapter';

describe('outconBidAdapter', function () {
	//////////////////////////////////////////////////
	describe('bidRequestValidity', function () {
		it('Check the bidRequest with pod param', function () {
			expect(spec.isBidRequestValid({
				bidder: 'outcom',
				params: {
					pod: "5d6e6abc22063e392bf7f563",
				}
			})).to.equal(true);
		});
		it('Check the bidRequest with internalID and publisherID params', function () {
			expect(spec.isBidRequestValid({
				bidder: 'outcom',
				params: {
					internalId: "12345",
					publisher: "5beeb1fd306ea4779e464532",
				}
			})).to.equal(true);
		});
	});
	/////////////////////////////////////////////////
	describe('buildRequests', function () {
		it('Build requests with pod param', function () {
			expect(spec.buildRequests({
				bidder: 'outcom',
				params: {
					pod: "5d6e6abc22063e392bf7f563",
				}
			})).to.eql({
				method: 'GET',
				url: 'http://outcon.dokkogroup.com.ar:8048/ad/',
				data: {pod: '5d6e6abc22063e392bf7f563'}
			});
		});
		it('Build requests with internalID and publisherID params', function () {
			expect(spec.buildRequests({
				bidder: 'outcom',
				params: {
					internalId: "12345678",
					publisher: "5beeb1fd306ea4779e464532",
				}
			})).to.eql({
				method: 'GET',
				url: 'http://outcon.dokkogroup.com.ar:8048/ad/',
				data: {
					internalId: '12345678',
					publisher: '5beeb1fd306ea4779e464532'
				}
			});
		});
	});
	/////////////////////////////////////////////////
	//('cpm', 'creatives', 'width', 'height', 'id', 'cur', 'exp', 'url', 'trackingURL')
	describe('interpretResponse', function () {
		const bidRequest = {
			method: 'GET',
			url: 'http://outcon.dokkogroup.com.ar:8048/ad/',
			data: {pod: '5d6e6abc22063e392bf7f563'}
		};

		const bidResponse = {
			body: {
				cpm: 0.10,
				cur: 'USD',
				exp: 10,
				creatives:[
					{
						url: "http://outcon.dokkogroup.com.ar/uploads/5d42e7a7306ea4689b67c122/frutas.mp4",
						size: 3,
						width: 1920,
						height: 1080,
						codec: "video/mp4"
					}
				],
				id: '5d6e6aef22063e392bf7f564',
				type: 'video',
				campaign: '5d42e44b306ea469593c76a2',
				trackingURL: 'http://outcon.dokkogroup.com.ar:8048/ad/track?track=5d6e6aef22063e392bf7f564'
			},
		};

		it('check all the keys that are needed to interpret the response', function () {
			const result = spec.interpretResponse(bidResponse, bidRequest);

		let requiredKeys = [
			'requestId',
			'cpm',
			'width',
			'height',
			'creativeId',
			'currency',
			'netRevenue',
			'ttl',
			'ad',
			'vastImpUrl'
		];
			let resultKeys = Object.keys(result[0]);
			resultKeys.forEach(function(key) {
		 		expect(requiredKeys.indexOf(key) !== -1).to.equal(true);
			});
		})
	});
});