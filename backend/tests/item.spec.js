const { expect } = require('chai');
const sinon = require('sinon');
const { LostItem, FoundItem } = require('../models/Item');
const itemController = require('../controllers/item');

describe('GetLostRequest Controller', () => {
  let sandbox;
  let req, res, next;
  let findByIdStub;

  before(() => {
    sandbox = sinon.createSandbox();
  });

  after(() => {
    sinon.restore();
  });

  beforeEach(() => {
    req = {
      params: { id: 'valid_item_id' },
    };

    res = {
      json: sandbox.spy(),
      status: sandbox.stub().returnsThis(),
    };

    next = sandbox.spy();
    findByIdStub = sandbox.stub(LostItem, 'findById');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return lost item details for a valid ID', async () => {
    const mockItem = { itemName: 'Test Item', type: 'Test Type' };
    findByIdStub.withArgs('valid_item_id').resolves(mockItem);

    await itemController.getLostRequest(req, res, next);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({ lostItem: mockItem })).to.be.true;
  });

  it('should return a 404 status when the lost item is not found', async () => {
    findByIdStub.withArgs('invalid_item_id').resolves(null);

    await itemController.getLostRequest(req, res, next);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Lost item not found' })).to.be.true;
  });
});

describe('GetFoundRequest Controller', () => {
  let sandbox;
  let req, res, next;
  let findByIdStub;

  before(() => {
    sandbox = sinon.createSandbox();
  });

  after(() => {
    sinon.restore();
  });

  beforeEach(() => {
    req = {
      params: { id: 'valid_item_id' },
    };

    res = {
      json: sandbox.spy(),
      status: sandbox.stub().returnsThis(),
    };

    next = sandbox.spy();
    findByIdStub = sandbox.stub(FoundItem, 'findById');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return found item details for a valid ID', async () => {
    const mockItem = { itemName: 'Test Item', type: 'Test Type' };
    findByIdStub.withArgs('valid_item_id').resolves(mockItem);

    await itemController.getFoundRequest(req, res, next);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({ foundItem: mockItem })).to.be.true;
  });

  it('should return a 404 status when the found item is not found', async () => {
    findByIdStub.withArgs('invalid_item_id').resolves(null);

    await itemController.getFoundRequest(req, res, next);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Found item not found' })).to.be.true;
  });
});

describe('CreateLostRequest Controller', function() {
  let req, res, next, lostItemStub, uploadToS3Stub;

  beforeEach(function() {
    // Stubbing the response object
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };

    // Stubbing the next function
    next = sinon.stub();

    // Mocking the request object
    req = {
      body: {
        type: 'Test Type',
        brand: 'Test Brand',
        size: 'M',
        colour: 'Red',
        locationLost: 'Test Location',
        description: 'Test Description',
        itemName: 'Test Item',
        user: { _id: 'user_id' },
      },
      user: {
        _id: 'testUserId'
      },
      files: []
    };

    // Stubbing the LostItem constructor
    lostItemStub = sinon.stub(LostItem.prototype, 'save');

    // Stubbing the uploadToS3 function
    uploadToS3Stub = sinon.stub(itemController, 'uploadToS3');
  });

  afterEach(function() {
    sinon.restore();
  });

  it('should create a lost item successfully', async function() {
    // Set up stubs and mocks
    lostItemStub.resolves({ _id: 'testItemId' });
    uploadToS3Stub.resolves('testUrl');

    await itemController.createLostRequest(req, res, next);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });

  it('should upload files to S3 if present', async function() {
    // Update req to include files
    req.files = [{}, {}]; // Mock files
    uploadToS3Stub.resolves('testUrl');

    await itemController.createLostRequest(req, res, next);

    expect(uploadToS3Stub.callCount).to.equal(2);
    expect(uploadToS3Stub.calledWith('lost-items', sinon.match.object)).to.be.true;
  });

  it('should handle errors correctly', async function() {
    const error = new Error('Test error');
    lostItemStub.rejects(error);

    await itemController.createLostRequest(req, res, next);

    expect(next.calledWith(error)).to.be.true;
  });
});
