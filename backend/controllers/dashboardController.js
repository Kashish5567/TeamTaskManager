const Task = require("../models/task");
const Project = require("../models/Project");


// ==========================================
// DASHBOARD ANALYTICS
// ==========================================

const getDashboardData = async (req, res) => {

  try {

    const projects = await Project.find({
      members: req.user._id,
    }).select("_id");

    const projectIds = projects.map((p) => p._id);

    const adminExists = await Project.exists({
      admin: req.user._id,
    });

    const taskMatch = adminExists
      ? { project: { $in: projectIds } }
      : {
          project: { $in: projectIds },
          assignedTo: req.user._id,
        };

    // TOTAL TASKS

    const totalTasks = await Task.countDocuments(taskMatch);


    // TASKS BY STATUS

    const todoTasks = await Task.countDocuments({
      ...taskMatch,
      status: "To Do",
    });

    const inProgressTasks =
      await Task.countDocuments({
        ...taskMatch,
        status: "In Progress",
      });

    const doneTasks =
      await Task.countDocuments({
        ...taskMatch,
        status: "Done",
      });


    // OVERDUE TASKS

    const overdueTasks =
      await Task.countDocuments({
        ...taskMatch,

        dueDate: {
          $lt: new Date(),
        },

        status: {
          $ne: "Done",
        },

      });


    // TASKS PER USER

    const tasksPerUser =
      await Task.aggregate([

        {
          $match: {
            ...taskMatch,
          },
        },

        {
          $group: {

            _id: "$assignedTo",

            totalTasks: {
              $sum: 1,
            },

          },
        },

      ]);


    res.status(200).json({

      totalTasks,

      tasksByStatus: {
        todo: todoTasks,
        inProgress: inProgressTasks,
        done: doneTasks,
      },

      completedTasks: doneTasks,
      pendingTasks: todoTasks + inProgressTasks,

      overdueTasks,

      tasksPerUser,

    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

module.exports = {
  getDashboardData,
};
