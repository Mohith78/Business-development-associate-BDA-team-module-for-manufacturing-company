import Activity from '../models/Activity.js';

export const createActivity = async ({ user, action, target }) => {
  return Activity.create({ user, action, target });
};
