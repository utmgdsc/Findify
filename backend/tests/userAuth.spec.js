const { expect } = require('chai');
const sinon = require('sinon');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const userController = require('../controllers/user');
const { register } = require('../controllers/user');
const OtpPairs = require('../models/Otp');

describe('Register Controller', () => {
  let sandbox;
  let req, res, next;
  let otpPairMock, saveUserStub;

  // Define reusable setup code
  before(() => {
    sandbox = sinon.createSandbox();
  });

  // Define reusable cleanup code
  after(() => {
    sandbox.restore();
  });

  // Common setup for each test case
  beforeEach(() => {
    // Reset request object for each test
    req = {
      body: {
        email: 'test@example.com',
        password: 'testPassword',
        firstName: 'John',
        lastName: 'Doe',
        contactNumber: '1234567890',
        OTP: '123456',
      },
    };
    res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.spy(),
    };
    next = sandbox.spy();

    otpPairMock = {
      email: req.body.email,
      OTP: '123456', // correct OTP
      OTPCreatedTime: new Date(),
      isBlocked: false,
      save: sandbox.stub().resolves(),
      OTPAttempts: 0,
    };

    saveUserStub = sandbox.stub(User.prototype, 'save').resolves({ _id: 'new_user_id' });
  });

  // Common cleanup after each test case
  afterEach(() => {
    // Clear the Sinon stubs and spies
    sandbox.restore();
  });

  // Individual test cases
  it('should register a new user', async () => {
    // Mock the required functions for this test
    sandbox.stub(OtpPairs, 'findOne')
      .withArgs({ email: req.body.email })
      .resolves(otpPairMock);
    sandbox.stub(User, 'countDocuments')
      .withArgs({ email: req.body.email })
      .resolves(0);

    // Call the register controller function
    await register(req, res, next);

    // Assertions
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith({ message: 'Registration Successful' })).to.be.true;
    expect(next.notCalled).to.be.true;
    expect(saveUserStub.calledOnce).to.be.true;
  });

  it('should return an error if email is already registered', async () => {
    // Mock the required functions for this test
    sandbox.stub(OtpPairs, 'findOne')
      .withArgs({ email: req.body.email })
      .resolves(otpPairMock);

    sandbox.stub(User, 'countDocuments')
      .withArgs({ email: req.body.email })
      .resolves(1);

    // Call the register controller function
    await register(req, res, next);

    // Assertions
    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({ message: 'Email is already registered' })).to.be.true;
    expect(next.notCalled).to.be.true;
  });

  it('should return an error if user has not been sent OTP', async () => {
    // Mock the required functions for this test
    sandbox.stub(User, 'countDocuments')
      .withArgs({ email: req.body.email })
      .resolves(0);

    sandbox.stub(OtpPairs, 'findOne')
      .withArgs({ email: req.body.email })
      .resolves(null);

    // Call the register controller function
    await register(req, res, next);

    // Assertions
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'User has not been sent OTP' })).to.be.true;
    expect(next.notCalled).to.be.true;
  });

  it('should return an error if the OTP in the request body is incorrect', async () => {
    // Mock the required functions for this test
    sandbox.stub(OtpPairs, 'findOne')
      .withArgs({ email: req.body.email })
      .resolves(otpPairMock);

    sandbox.stub(User, 'countDocuments')
      .withArgs({ email: req.body.email })
      .resolves(0);

    // incorrect OTP
    req.body.OTP = '999999';

    // Call the register controller function
    await register(req, res, next);

    // Assertions
    expect(res.status.calledWith(403)).to.be.true;
    expect(res.json.calledWith({ message: 'Invalid OTP' })).to.be.true;

    expect(otpPairMock.save.calledOnce).to.be.true;
    expect(otpPairMock.OTPAttempts).to.equal(1);

    expect(next.notCalled).to.be.true;
  });

  it('should return a 403 error if the user is already blocked', async () => {
    // Mock the required functions for this test
    sandbox.stub(User, 'countDocuments').resolves(0);

    // Mock the OtpPairs.findOne function to return a blocked OTP pair
    const blockedOtpPairMock = {
      ...otpPairMock,
      isBlocked: true, // User is already blocked
      blockUntil: new Date(Date.now() + (60 * 60 * 1000)), // 1 hour from now
      OTPAttempts: 4, // Maximum allowed attempts reached
    };

    sandbox.stub(OtpPairs, 'findOne')
      .withArgs({ email: req.body.email })
      .resolves(blockedOtpPairMock);

    // Call the register controller function
    await register(req, res, next);

    // Assertions
    expect(res.status.calledWith(403)).to.be.true;
    expect(res.json.calledWith({ message: 'User blocked. Try after some time again.' })).to.be.true;
    expect(next.notCalled).to.be.true;
  });

  it('should return a 403 error if the OTP attempts exceed the limit', async () => {
    // Mock the required functions for this test
    sandbox.stub(User, 'countDocuments').resolves(0);

    // Mock the OtpPairs.findOne function to return an OTP pair with exceeded attempts
    const exceededAttemptsOtpPairMock = {
      ...otpPairMock,
      OTP: '999999', // incorrect OTP
      OTPAttempts: 3,
    };
    sandbox.stub(OtpPairs, 'findOne')
      .withArgs({ email: req.body.email })
      .resolves(exceededAttemptsOtpPairMock);

    // Call the register controller function
    await register(req, res, next);

    // Assertions
    expect(res.status.calledWith(403)).to.be.true;
    expect(res.json.calledWith({ message: 'Invalid OTP' })).to.be.true;
    // make sure otpPaired is blocked
    expect(exceededAttemptsOtpPairMock.isBlocked).to.be.true;
    expect(exceededAttemptsOtpPairMock.blockUntil).to.be.lessThanOrEqual(new Date(Date.now() + (60 * 60 * 1000)));
    expect(next.notCalled).to.be.true;
  });

  it('should return a 403 error if the OTP has expired', async () => {
    // Mock the required functions for this test
    sandbox.stub(User, 'countDocuments').resolves(0);

    // Mock the OtpPairs.findOne function to return an OTP pair with an expired OTP
    const expiredOTPPairMock = {
      email: req.body.email,
      OTP: '123456', // correct OTP
      OTPCreatedTime: new Date(Date.now() - (31 * 60 * 1000)), // 31 minutes ago (expired)
      isBlocked: false,
      save: sandbox.stub().resolves(),
      OTPAttempts: 0,
    };
    sandbox.stub(OtpPairs, 'findOne')
      .withArgs({ email: req.body.email })
      .resolves(expiredOTPPairMock);

    // Call the register controller function
    await register(req, res, next);

    // Assertions
    expect(res.status.calledWith(403)).to.be.true;
    expect(res.json.calledWith({ message: 'OTP expired' })).to.be.true;
    expect(next.notCalled).to.be.true;
  });

});


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
