const { expect } = require('chai');
const sinon = require('sinon');
const { register } = require('../controllers/user');
const User = require('../models/User');
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
