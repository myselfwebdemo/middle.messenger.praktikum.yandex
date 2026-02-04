import { expect } from 'chai';
import sinon from 'sinon';
import EndPointAPI from './api.ts';
import { SERVER_BASE_URL } from '../../config.ts';

class FakeXHR {
    method: string = '';
    url: string = '';
    withCredentials = false;
    responseType = '';
    headers: Record<string, string> = {};
    requestBody: any = null;
    status: number = 0;
    response: any = null;
    onload: Function | null = null;
    onerror: Function | null = null;

    open(method: string, url: string) {
        this.method = method;
        this.url = url;
    }

    setRequestHeader(key: string, value: string) {
        this.headers[key] = value;
    }

    send(body?: any) {
        this.requestBody = body;
        if (this.onload) {
            if (this.status === 0) this.status = 200;
            if (!this.response) this.response = { ok: true };
            this.onload({} as Event);
        }
    }
}

describe('EndPointAPI module', () => {
    let xhrStub: sinon.SinonStub;

    beforeEach(() => {
        xhrStub = sinon.stub(globalThis as any, 'XMLHttpRequest').callsFake(() => new FakeXHR());
    });

    afterEach(() => {
        xhrStub.restore();
    });

    it('GET should call open() with correct URL and method', async () => {
        const api = new EndPointAPI('test');
        await api.get('/endpoint');
        const fake = xhrStub.firstCall.returnValue as FakeXHR;

        expect(fake.method).to.equal('GET');
        expect(fake.url).to.equal(`${SERVER_BASE_URL}test/endpoint`);
        expect(fake.withCredentials).to.be.true;
        expect(fake.responseType).to.equal('json');
    });

    it('POST should send JSON body', async () => {
        const api = new EndPointAPI('test');
        const data = { login: 'test' };
        await api.post('/foo', { data });
        const fake = xhrStub.firstCall.returnValue as FakeXHR;

        expect(fake.method).to.equal('POST');
        expect(fake.url).to.equal(`${SERVER_BASE_URL}test/foo`);
        expect(fake.headers['Content-Type']).to.equal('application/json');
        expect(fake.requestBody).to.equal(JSON.stringify(data));
    });

    it('PUT should send JSON body', async () => {
        const api = new EndPointAPI('test');
        const data = { login: 'update' };
        await api.put('/bar', { data });
        const fake = xhrStub.firstCall.returnValue as FakeXHR;

        expect(fake.method).to.equal('PUT');
        expect(fake.url).to.equal(`${SERVER_BASE_URL}test/bar`);
        expect(fake.headers['Content-Type']).to.equal('application/json');
        expect(fake.requestBody).to.equal(JSON.stringify(data));
    });

    it('DELETE should send JSON body', async () => {
        const api = new EndPointAPI('test');
        const data = { login: 'delete' };
        await api.delete('/baz', { data });
        const fake = xhrStub.firstCall.returnValue as FakeXHR;

        expect(fake.method).to.equal('DELETE');
        expect(fake.url).to.equal(`${SERVER_BASE_URL}test/baz`);
        expect(fake.headers['Content-Type']).to.equal('application/json');
        expect(fake.requestBody).to.equal(JSON.stringify(data));
    });

    it('should send FormData without JSON headers', async () => {
        const api = new EndPointAPI('test');
        const formData = new FormData();
        formData.append('login', 'form');
        await api.post('/form', { data: formData });
        const fake = xhrStub.firstCall.returnValue as FakeXHR;

        expect(fake.method).to.equal('POST');
        expect(fake.headers['Content-Type']).to.be.undefined;
        expect(fake.requestBody).to.equal(formData);
    });

    it('should reject promise on non-2xx status', async () => {
        const api = new EndPointAPI('test');
        const fake = new FakeXHR();
        xhrStub.callsFake(() => fake);
        fake.status = 500;
        fake.response = { error: 'Server error' };

        try {
            await api.get('/fail');
        } catch (err: any) {
            expect(err.status).to.equal(500);
            expect(err.response).to.deep.equal({ error: 'Server error' });
        }
    });

    it('should resolve promise on successful response', async () => {
        const api = new EndPointAPI('test');
        const fake = new FakeXHR();
        xhrStub.callsFake(() => fake);
        fake.status = 200;
        fake.response = { success: true };

        const res = await api.get('/ok');
        expect(res).to.deep.equal({ success: true });
    });
});
