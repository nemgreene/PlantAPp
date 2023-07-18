const moment = require("moment");

const normalizeOverview = (usersArr = [], plantsArr = []) => {
  //users
  const users = { byId: {} };
  const userPlants = { byId: {}, allIds: [] };
  users.allIds = [
    ...new Set(
      usersArr.map((user) => {
        users.byId[user._id] = { ...(users.byId[user._id] || {}), ...user };
        userPlants.byId[user._id] = {
          ...(userPlants.byId[user._id] || {}),
          ...user,
        };
        if (!userPlants.allIds.includes(user._id))
          userPlants.allIds.push(user._id);
        userPlants.byId[user._id] = plantsArr
          .filter((plant) => plant.userId === user._id)
          .sort((a, b) => new Date(a.dateWatered) - new Date(b.dateWatered));
        return user._id;
      })
    ),
  ];
  //plants
  const plants = { byId: {} };
  const wateredDate = { byId: {}, allDates: [] };

  plantsArr = plantsArr.filter((p) => users.allIds.includes(p.userId));
  plants.allIds = [
    ...new Set(
      plantsArr
        .sort((a, b) => new Date(a.dateWatered) - new Date(b.dateWatered))
        .map((plant) => {
          plants.byId[plant._id] = {
            ...(plants.byId[plant._id] || {}),
            ...plant,
          };
          wateredDate.byId[plant._id] = {
            ...(wateredDate.byId[plant._id] || {}),
            ...plant,
          };
          if (!wateredDate.allDates.includes(plant.dateWatered))
            wateredDate.allDates.push(plant.dateWatered);
          return plant._id;
        })
    ),
  ];
  const ret = { entities: { users, plants, wateredDate, userPlants } };

  return ret;
};

// Enable for jest testing
// module.exports = normalizeOverview;

// Enable for deployment
export default normalizeOverview;
