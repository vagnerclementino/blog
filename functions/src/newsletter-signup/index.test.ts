import { newsletterSignup } from './index';
import mailchimp from 'mailchimp-api-v3';

// Mock mailchimp client
jest.mock('mailchimp-api-v3');

describe('newsletterSignup', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      method: 'POST',
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    // Reset env
    delete process.env.MAILCHIMP_LIST_ID;
    delete process.env.MAILCHIMP_API_KEY;
    delete process.env.MAILCHIMP_SERVER;
    // Reset mailchimp mock
    (mailchimp as any).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 405 for non-POST methods', async () => {
    req.method = 'GET';
    await newsletterSignup(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ message: 'Method Not Allowed' });
  });

  it('should return 400 if name or email missing', async () => {
    req.body = { name: '' };
    await newsletterSignup(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Nome e email são obrigatórios.' });

    req.body = { email: 'test@example.com' };
    await newsletterSignup(req, res);
    expect(res.status).toHaveBeenCalledWith(400);

    req.body = { name: 'John' };
    await newsletterSignup(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 500 if MAILCHIMP_LIST_ID not configured', async () => {
    req.body = { name: 'John', email: 'john@example.com' };
    await newsletterSignup(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Configuração do servidor incompleta.' });
  });

  it('should successfully subscribe user', async () => {
    const mockAddMembers = jest.fn().mockResolvedValue({});
    (mailchimp as any).mockImplementation(() => ({
      lists: { addMembers: mockAddMembers },
    }));

    req.body = { name: 'John', email: 'john@example.com' };
    process.env.MAILCHIMP_LIST_ID = 'list123';
    process.env.MAILCHIMP_API_KEY = 'test-key';
    process.env.MAILCHIMP_SERVER = 'us1';

    await newsletterSignup(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Inscrição realizada com sucesso!' });
    expect(mockAddMembers).toHaveBeenCalledWith('list123', [
      { email_address: 'john@example.com', status: 'subscribed', merge_fields: { FNAME: 'John' } }
    ]);
  });

  it('should handle already member error gracefully', async () => {
    const mockError = new Error('Member Exists');
    // @ts-ignore - adding custom properties to Error
    mockError.status = 400;
    // @ts-ignore
    mockError.detail = 'Member Exists';
    const mockAddMembers = jest.fn().mockRejectedValue(mockError);
    (mailchimp as any).mockImplementation(() => ({
      lists: { addMembers: mockAddMembers },
    }));

    req.body = { name: 'John', email: 'john@example.com' };
    process.env.MAILCHIMP_LIST_ID = 'list123';
    process.env.MAILCHIMP_API_KEY = 'test-key';
    process.env.MAILCHIMP_SERVER = 'us1';

    await newsletterSignup(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Você já está inscrito!' });
  });

  it('should handle generic errors with 500', async () => {
    const mockAddMembers = jest.fn().mockRejectedValue(new Error('API Error'));
    (mailchimp as any).mockImplementation(() => ({
      lists: { addMembers: mockAddMembers },
    }));

    req.body = { name: 'John', email: 'john@example.com' };
    process.env.MAILCHIMP_LIST_ID = 'list123';
    process.env.MAILCHIMP_API_KEY = 'test-key';
    process.env.MAILCHIMP_SERVER = 'us1';

    await newsletterSignup(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao processar inscrição. Tente novamente.' });
  });
});
