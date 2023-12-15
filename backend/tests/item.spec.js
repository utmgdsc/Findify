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
