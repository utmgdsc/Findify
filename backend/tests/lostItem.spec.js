// const chai = require('chai');
// const sinon = require('sinon');
// const proxyquire = require('proxyquire');
// const chaiHttp = require('chai-http');
// const expect = chai.expect;

// chai.use(chaiHttp);

// // Mock dependencies
// const LostItemMock = {
//   findOne: sinon.stub(),
//   findOneAndUpdate: sinon.stub(),
//   // other methods as necessary
// };

// const errorHandlerMock = sinon.stub();
// const uploadToS3Mock = sinon.stub();

// // Proxyquire to inject mocks
// const controller = proxyquire('../controllers/item', {
//   '../models/Item': { LostItem: LostItemMock },
//   '../utils/errorHandler': errorHandlerMock,
//   '../utils/aws': { uploadToS3: uploadToS3Mock },
//   // other dependencies as necessary
// });

// // App setup (if you're testing an Express controller)
// const express = require('express');
// const app = express();
// app.use(express.json());
// app.post('/lost', controller.createLostRequest);
// app.get('/lost/:id', controller.getLostRequest);
// app.put('/lost', controller.editLostRequest);

// describe('Item Controller', () => {

//   beforeEach(() => {
//     // Reset the mocks before each test
//     sinon.reset();
//   });

//   describe('getLostRequest', () => {
//     it('should retrieve a lost item by ID', async () => {
//       const fakeLostItem = { _id: '123', itemName: 'Test Item' };
//       LostItemMock.findOne.resolves(fakeLostItem);

//       const res = await chai.request(app).get('/lost/123');
//       expect(res).to.have.status(200);
//       expect(res.body).to.deep.equal(fakeLostItem);
//     });

//     // Additional test cases for error handling
//   });

//   describe('createLostRequest', () => {
//     it('should create a new lost item request', async () => {
//       const newItemData = {
//         type: 'Test Type',
//         brand: 'Test Brand',
//         // ...other properties
//       };

//       uploadToS3Mock.resolves('mockImageUrl');
//       LostItemMock.prototype.save = sinon.stub().resolves(newItemData);

//       const res = await chai.request(app)
//         .post('/lost')
//         .send(newItemData);

//       expect(res).to.have.status(200);
//       expect(res.body.message).to.equal('Created lost item successfully');
//       // Additional assertions here
//     });

//     // Additional test cases
//   });

//   describe('editLostRequest', () => {
//     it('should edit an existing lost item request', async () => {
//       const fakeLostItem = { _id: '123', itemName: 'Test Item' };
//       const updateData = { itemName: 'Updated Item' };

//       LostItemMock.findOne.resolves(fakeLostItem);
//       LostItemMock.findOneAndUpdate.resolves({ ...fakeLostItem, ...updateData });

//       const res = await chai.request(app)
//         .put('/lost')
//         .send({ lostRequestId: '123', ...updateData });

//       expect(res).to.have.status(200);
//       expect(res.body.message).to.equal('Editted lost item successfully');
//       // Additional assertions here
//     });

//     // Additional test cases
//   });

//   // ... other describe blocks for additional methods

// });
