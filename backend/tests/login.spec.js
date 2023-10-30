const { expect } = require('chai');
const sinon = require('sinon');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const userController = require('../controllers/user');

describe('Login Controller', () => {
  let sandbox;
  let req, res, next;
  let userMock, jwtSignStub, findOneStub;

  before(() => {
    // Perform setup that is common to all test cases here
    userMock = {
      _id: 'user_id',
      comparePassword: sinon.stub(),
    };

    jwtSignStub = sinon.stub(jwt, 'sign');
  });

  after(() => {
    // Perform cleanup after all test cases here
    sinon.restore();
  });

  beforeEach(() => {
    // Initialize req, res, and next for each test case
    sandbox = sinon.createSandbox();

    req = {
      body: {
        email: 'test@example.com',
        password: 'testPassword',
      },
    };
    res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.spy(),
    };
    next = sandbox.spy();
  });

  afterEach(() => {
    // Add any additional cleanup needed after each test case
    sandbox.restore();
  });

  it('should return a JWT token on successful login', async () => {
    // Mock the User.findOne function to return a user object
    userMock.comparePassword.returns(true);

    findOneStub = sandbox.stub(User, 'findOne');
    findOneStub.withArgs({ email: req.body.email }).resolves(userMock);

    // Mock the jwt.sign function to return a token
    jwtSignStub.returns('mocked_token');

    // Call the login controller function
    await userController.login(req, res, next);

    // Assertions
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({ token: 'mocked_token' })).to.be.true;
    expect(next.notCalled).to.be.true;
  });

  it('should return an error if the user is not found', async () => {
    // Mock the User.findOne function to return null, simulating a user not found
    findOneStub = sandbox.stub(User, 'findOne').resolves(null);

    // Call the login controller function
    await userController.login(req, res, next);

    // Assertions
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'User not found' })).to.be.true;
    expect(next.notCalled).to.be.true;
  });

  it('should return an error if the password is incorrect', async () => {
    // Mock the User.findOne function to return a user object
    findOneStub = sandbox.stub(User, 'findOne').resolves(userMock);

    // Set the comparePassword function to return false, simulating an incorrect password
    userMock.comparePassword.returns(false);

    // Call the login controller function
    await userController.login(req, res, next);

    // Assertions
    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ message: 'Incorrect password' })).to.be.true;
    expect(next.notCalled).to.be.true;
  });
});
