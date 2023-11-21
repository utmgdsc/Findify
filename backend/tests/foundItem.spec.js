// const expect = require('chai').expect;
// const sinon = require('sinon');
// const mongoose = require('mongoose');

// const FoundItem = require('../models/Item').FoundItem; // Ensure this matches your actual export
// const { getFoundRequest, createFoundRequest, editFoundRequest } = require('../controllers/item');

// describe('FoundItem Controller', function () {
//   let foundItemStub, saveStub, findOneStub, findOneAndUpdateStub, status, json, res, errorHandlerStub;

//   beforeEach(function () {
//     foundItemStub = sinon.stub(FoundItem, 'findOne');
//     saveStub = sinon.stub(FoundItem.prototype, 'save');
//     findOneAndUpdateStub = sinon.stub(FoundItem, 'findOneAndUpdate');
//     errorHandlerStub = sinon.stub();

//     status = sinon.stub();
//     json = sinon.spy();
//     res = { status: status, json: json };
//     status.returns(res);
//   });

//   afterEach(function () {
//     sinon.restore();
//   });

//   describe('getFoundRequest', function () {
//     it('should find a found item by id and return it', async function () {
//       const foundItem = { _id: 'testId', name: 'Test Item' };
//       foundItemStub.resolves(foundItem);

//       const req = { body: { foundRequestId: 'testId' } };

//       const result = await getFoundRequest(req, res, () => { });

//       expect(foundItemStub.calledOnceWith({ _id: 'testId' })).to.be.true;
//       expect(result).to.deep.equal(foundItem);
//     });

//     it('should return 500 if there is a server error', async function () {
//       foundItemStub.rejects(new Error('test error'));

//       const req = { body: { foundRequestId: 'testId' } };

//       await getFoundRequest(req, res, () => { });

//       expect(status.calledWith(500)).to.be.true;
//       expect(json.calledWith({ message: 'Error fetching foundItem details' })).to.be.true;
//     });
//   });

//   describe('createFoundRequest', function () {
//     it('should create a found item and respond with success', async function () {
//       saveStub.resolves();

//       const req = {
//         body: {
//           type: 'Electronics',
//           brand: 'BrandName',
//           size: 'Medium',
//           colour: 'Black',
//           locationFound: 'LocationName',
//           description: 'Description here',
//           itemName: 'ItemName'
//         },
//         user: { _id: 'userId' },
//         files: [
//           { originalname: 'testImage1.jpg' },
//           { originalname: 'testImage2.jpg' }
//         ]
//       };

//       await createFoundRequest(req, res, errorHandlerStub);

//       expect(saveStub.called).to.be.true;
//       expect(status.calledWith(200)).to.be.true;
//       expect(json.calledWithMatch({ message: 'Created found item successfully' })).to.be.true;
//     });

//     it('should call errorHandler on error', async function () {
//       saveStub.throws(new Error('Save failed'));

//       const req = {
//         body: {
//           type: 'Electronics',
//           // other properties
//         },
//         user: { _id: 'userId' },
//         files: []
//       };

//       await createFoundRequest(req, res, errorHandlerStub);

//       expect(errorHandlerStub.called).to.be.true;
//     });
//   });

//   describe('editFoundRequest', function () {
//     it('should edit a found item and respond with success', async function () {
//       const foundItemMock = {
//         _id: 'someId',
//         host: { _id: 'hostId', equals: sinon.stub().returns(true) },
//         itemName: 'Original ItemName',
//         // other properties
//         save: sinon.stub().resolves()
//       };

//       findOneStub.resolves(foundItemMock);
//       findOneAndUpdateStub.resolves(foundItemMock);

//       const req = {
//         body: {
//           foundRequestId: 'someId',
//           itemName: 'New ItemName',
//           // other properties to update
//         },
//         user: { _id: 'hostId' },
//         files: [{ originalname: 'testImage.jpg' }]
//       };

//       await editFoundRequest(req, res, errorHandlerStub);

//       expect(findOneAndUpdateStub.called).to.be.true;
//       expect(status.calledWith(200)).to.be.true;
//       expect(json.calledWithMatch({ message: 'Editted found item successfully' })).to.be.true;
//     });

//     it('should throw an error if user does not own the found request', async function () {
//       const foundItemMock = {
//         _id: 'someId',
//         host: { _id: 'hostId', equals: sinon.stub().returns(false) },
//         itemName: 'Original ItemName',
//         // other properties
//         save: sinon.stub().resolves()
//       };

//       findOneStub.resolves(foundItemMock);

//       const req = {
//         body: { foundRequestId: 'someId' },
//         user: { _id: 'otherUserId' }
//       };

//       try {
//         await editFoundRequest(req, res, errorHandlerStub);
//       } catch (err) {
//         expect(err.message).to.equal('401 Unauthorized: User does not own found request');
//       }

//       expect(errorHandlerStub.called).to.be.true;
//     });
//   });
// });
