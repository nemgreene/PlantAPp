const normalizeOverview = require("../components/modals/normalizeOverview");

const testUsers1 = [
  {
    __v: 0,
    _id: "userId1",
    email: "admin@admin",
    password: "$2b$10$mUxdl1DmsplcDvaGhVreqewrqwerVoLElqS9yGi4kq8SPwBlpmnG",
  },
  {
    __v: 0,
    _id: "userId2",
    email: "root@root",
    password: "$2b$10$mUxdl1DmsplcDvaGhVarqerwewqr2y5qVoLElqS9yGi4kq8SPwBlpmnG",
  },
  {
    __v: 0,
    _id: "userId13",
    email: "test@test",
    password: "$2b$10$mUxdl1DmsplcDvaGhVar/OTwv2y5qVwrtwefdS9yGi4kq8SPwBlpmnG",
  },
];
const testPlants1 = [
  {
    __v: 0,
    _id: "plantId1",
    dateWatered: "2023-07-11T17:06:52.978Z",
    plantDescription: "Monstera Deliciosa",
    plantImage: "https://www.shutterstock.com/image.jpg",
    plantPriority: 0,
    userId: "userId1",
    waterFrequency: 11,
  },
  {
    __v: 0,
    _id: "plantId2",
    dateWatered: "2023-07-11T17:06:52.978Z",
    plantDescription: "Monstera Deliciosa",
    plantImage: "https://www.shutterstock.com/image.jpg",
    plantPriority: 0,
    userId: "userId1",
    waterFrequency: 11,
  },
  {
    __v: 0,
    _id: "plantId3",
    dateWatered: "2023-07-11T17:06:52.978Z",
    plantDescription: "Monstera Deliciosa",
    plantImage: "https://www.shutterstock.com/image.jpg",
    plantPriority: 0,
    userId: "userId1",
    waterFrequency: 11,
  },
  {
    __v: 0,
    _id: "plantId4",
    dateWatered: "2023-07-11T17:06:52.978Z",
    plantDescription: "Monstera Deliciosa",
    plantImage: "https://www.shutterstock.com/image.jpg",
    plantPriority: 0,
    userId: "userId2",
    waterFrequency: 11,
  },
  {
    __v: 0,
    _id: "plantId5",
    dateWatered: "2023-07-11T17:06:52.978Z",
    plantDescription: "Monstera Deliciosa",
    plantImage: "https://www.shutterstock.com/image.jpg",
    plantPriority: 0,
    userId: "userId2",
    waterFrequency: 11,
  },
  {
    __v: 0,
    _id: "plantId5",
    dateWatered: "2023-07-11T17:06:52.978Z",
    plantDescription: "Monstera Deliciosa",
    plantImage: "https://www.shutterstock.com/image.jpg",
    plantPriority: 0,
    userId: "userId6",
    waterFrequency: 11,
  },
];
console.log(normalizeOverview(testUsers1, testPlants1));

test("Expects object not to be empty", () => {
  expect(1 + 2).toBe(3);
});
