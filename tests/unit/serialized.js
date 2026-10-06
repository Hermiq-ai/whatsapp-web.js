const { expect } = require('chai');

const {
    GetSerialized,
    GetSerializedWid,
    GetSerializedMsgKey,
} = require('../../src/util/Serialized');

describe('Serialized', function () {
    describe('GetSerializedWid', function () {
        it('returns nullish and string values unchanged', function () {
            expect(GetSerializedWid(null)).to.equal(null);
            expect(GetSerializedWid(undefined)).to.equal(undefined);
            expect(GetSerializedWid('123@c.us')).to.equal('123@c.us');
        });

        it('serializes and caches a user ID', function () {
            const id = { user: '123', server: 'c.us' };

            expect(GetSerializedWid(id)).to.equal('123@c.us');
            expect(id._serialized).to.equal('123@c.us');
        });

        it('includes a device ID when present', function () {
            const id = { user: '123', device: 2, server: 'c.us' };

            expect(GetSerializedWid(id)).to.equal('123:2@c.us');
        });

        it('serializes a call ID', function () {
            const id = { user: 'call', server: 'c.us' };

            expect(GetSerializedWid(id)).to.equal('call');
        });

        it('returns null for an unsupported shape', function () {
            expect(GetSerializedWid({ user: '123' })).to.equal(null);
        });
    });

    describe('GetSerializedMsgKey', function () {
        it('serializes a message key', function () {
            const id = {
                fromMe: true,
                remote: { user: '123', server: 'c.us' },
                id: 'MESSAGE',
            };

            expect(GetSerializedMsgKey(id)).to.equal('true_123@c.us_MESSAGE');
            expect(id._serialized).to.equal('true_123@c.us_MESSAGE');
        });

        it('includes self and participant IDs', function () {
            const id = {
                fromMe: false,
                remote: { user: 'group', server: 'g.us' },
                id: 'MESSAGE',
                self: 'self',
                participant: { user: '123', server: 'c.us' },
            };

            expect(GetSerializedMsgKey(id)).to.equal(
                'false_group@g.us_MESSAGE_self_123@c.us',
            );
        });
    });

    describe('GetSerialized', function () {
        it('uses an existing serialized value', function () {
            const id = { _serialized: 'cached', user: 'ignored' };

            expect(GetSerialized(id)).to.equal('cached');
        });

        it('selects the serializer based on the object shape', function () {
            expect(GetSerialized({ user: '123', server: 'c.us' })).to.equal(
                '123@c.us',
            );
            expect(
                GetSerialized({
                    fromMe: false,
                    remote: { user: '123', server: 'c.us' },
                    id: 'MESSAGE',
                }),
            ).to.equal('false_123@c.us_MESSAGE');
        });
    });
});
