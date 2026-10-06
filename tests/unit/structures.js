const { expect } = require('chai');

const LocalAuth = require('../../src/authStrategies/LocalAuth');
const Location = require('../../src/structures/Location');
const Poll = require('../../src/structures/Poll');
const ScheduledEvent = require('../../src/structures/ScheduledEvent');

describe('Standalone structures', function () {
    describe('Location', function () {
        it('builds a description from the name and address', function () {
            const location = new Location(59.437, 24.7536, {
                name: 'Tallinn',
                address: 'Estonia',
            });

            expect(location.latitude).to.equal(59.437);
            expect(location.longitude).to.equal(24.7536);
            expect(location.description).to.equal('Tallinn\nEstonia');
        });

        it('uses an empty description when details are absent', function () {
            const location = new Location(0, 0);

            expect(location.description).to.equal('');
        });
    });

    describe('Poll', function () {
        it('normalizes the poll name and options', function () {
            const poll = new Poll(' Question ', [' First ', 'Second'], {
                allowMultipleAnswers: true,
                messageSecret: [1, 2, 3],
            });

            expect(poll.pollName).to.equal('Question');
            expect(poll.pollOptions).to.deep.equal([
                { name: 'First', localId: 0 },
                { name: 'Second', localId: 1 },
            ]);
            expect(poll.options.allowMultipleAnswers).to.equal(true);
            expect(poll.options.messageSecret).to.deep.equal([1, 2, 3]);
        });

        it('disables multiple answers by default', function () {
            const poll = new Poll('Question', ['First']);

            expect(poll.options.allowMultipleAnswers).to.equal(false);
        });
    });

    describe('ScheduledEvent', function () {
        it('normalizes values and converts dates to timestamps', function () {
            const startTime = new Date('2026-10-06T10:00:00Z');
            const endTime = new Date('2026-10-06T11:00:00Z');
            const event = new ScheduledEvent(' Event ', startTime, {
                description: ' Description ',
                endTime: endTime,
                location: ' Tallinn ',
                callType: 'video',
            });

            expect(event.name).to.equal('Event');
            expect(event.startTimeTs).to.equal(1791280800);
            expect(event.eventSendOptions.endTimeTs).to.equal(1791284400);
            expect(event.eventSendOptions.description).to.equal('Description');
            expect(event.eventSendOptions.location).to.equal('Tallinn');
            expect(event.eventSendOptions.callType).to.equal('video');
            expect(event.eventSendOptions.isEventCanceled).to.equal(false);
        });

        it('rejects an empty event name', function () {
            expect(() => new ScheduledEvent('', new Date())).to.throw(
                "Empty 'name' parameter value is provided.",
            );
        });

        it('rejects an unsupported call type', function () {
            expect(
                () =>
                    new ScheduledEvent('Event', new Date(), {
                        callType: 'invalid',
                    }),
            ).to.throw("Invalid 'callType' parameter value is provided.");
        });
    });

    describe('LocalAuth', function () {
        it('accepts a safe client ID', function () {
            const auth = new LocalAuth({ clientId: 'client-1_test' });

            expect(auth.clientId).to.equal('client-1_test');
            expect(auth.rmMaxRetries).to.equal(4);
        });

        it('rejects an unsafe client ID', function () {
            expect(() => new LocalAuth({ clientId: '../client' })).to.throw(
                'Invalid clientId',
            );
        });
    });
});
