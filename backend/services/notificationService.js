const Notification = require("../models/Notification");

const create = async ({ user, type, title, desc }) => {
  const notif = await Notification.create({
    user,
    type,
    title,
    desc,
  });

  return notif;
};

module.exports = {
  create,
};
