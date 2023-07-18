const normalizeOverview = require("../components/modals/normalizeOverview");
const moment = require("moment");
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
    password: "Base password",
  },
  {
    __v: 0,
    _id: "userId2",
    email: "upsertTest",
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
    dateWatered: "2022-06-11T17:06:52.978Z",
    plantDescription: "Monstera Deliciosa",
    plantImage: "Base image test",
    plantPriority: 0,
    userId: "userId1",
    waterFrequency: 11,
  },
  {
    __v: 0,
    _id: "plantId1",
    dateWatered: "2022-07-11T17:06:02.978Z",
    plantDescription: "Monstera Deliciosa Upsert Test",
    userId: "userId1",
  },
  {
    __v: 0,
    _id: "plantId3",
    dateWatered: "2022-05-11T17:06:52.978Z",
    plantDescription: "Monstera Deliciosa",
    plantImage: "https://www.shutterstock.com/image.jpg",
    plantPriority: 0,
    userId: "userId1",
    waterFrequency: 11,
  },

  {
    __v: 0,
    _id: "plantId2",
    dateWatered: "2022-10-11T17:06:52.978Z",
    plantDescription: "Monstera Deliciosa",
    plantImage: "https://www.shutterstock.com/image.jpg",
    plantPriority: 0,
    userId: "userId6",
    waterFrequency: 11,
  },
  {
    __v: 0,
    _id: "plantId5",
    dateWatered: "2022-07-11T17:06:52.978Z",
    plantDescription: "Monstera Deliciosa",
    plantImage: "https://www.shutterstock.com/image.jpg",
    plantPriority: 0,
    userId: "userId2",
    waterFrequency: 11,
  },
];
const payload = normalizeOverview(testUsers1, testPlants1);
const { users, plants, wateredDate, userPlants } = payload.entities;

test("Expect all [allIds]/[allDates] to be type array", () => {
  expect(Array.isArray(users.allIds)).toBe(true);
  expect(Array.isArray(plants.allIds)).toBe(true);
  expect(Array.isArray(wateredDate.allDates)).toBe(true);
  expect(Array.isArray(userPlants.allIds)).toBe(true);
});

test("Verify payload hierarchy", () => {
  expect(Object.keys(payload)).toStrictEqual(["entities"]);
  expect(Object.keys(users)).toStrictEqual(["byId", "allIds"]);
  expect(Object.keys(plants)).toStrictEqual(["byId", "allIds"]);
  expect(Object.keys(wateredDate)).toStrictEqual(["byId", "allDates"]);
  expect(Object.keys(userPlants)).toStrictEqual(["byId", "allIds"]);
});

test("Verify {plants.[allIds]} is ordered from least recently watered to most", () => {
  plants.allIds.forEach((p, i, a) => {
    let prev = new Date(plants.byId[a[i - 1]]?.dateWatered || 0);
    let curr = new Date(plants.byId[p].dateWatered);
    expect(prev <= curr).toBe(true);
  });
});

test("Verify {wateredDate.[allDates]} is ordered from least recently watered to most", () => {
  wateredDate.allDates.forEach((p, i, a) => {
    expect(new Date(a[i - 1] || 0) <= new Date(p)).toBe(true);
  });
});

test("Verify upsert of duplicate users and plants", () => {
  expect(users.byId["userId2"].password).toBe("Base password");
  expect(users.byId["userId2"].email).toBe("upsertTest");
  expect(plants.byId["plantId1"].plantDescription).toBe(
    "Monstera Deliciosa Upsert Test"
  );
  expect(plants.byId["plantId1"].plantImage).toBe("Base image test");
});

test("Verify plant with user not in {user} is not present", () => {
  expect(users.allIds.includes("plantId2")).toBe(false);
});
