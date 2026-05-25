const Task = require("../models/task");

const Project = require("../models/Project");

const isProjectMember = (project, userId) =>
  project.members.some(
    (m) => m.toString() === userId.toString()
  );

const isProjectAdmin = (project, userId) =>
  project.admin.toString() === userId.toString();


// CREATE TASK

const createTask = async (req, res) => {

  try {

    const {
      title,
      description,
      dueDate,
      priority,
      assignedTo,
      projectId,
    } = req.body;


    if (!title || !projectId) {

      return res.status(400).json({
        message: "Title and Project ID required",
      });

    }


    const project = await Project.findById(
      projectId
    );


    if (!project) {

      return res.status(404).json({
        message: "Project not found",
      });

    }

    if (!isProjectMember(project, req.user._id)) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    if (!isProjectAdmin(project, req.user._id)) {
      return res.status(403).json({
        message: "Only admin can create tasks",
      });
    }

    if (assignedTo && !isProjectMember(project, assignedTo)) {
      return res.status(400).json({
        message: "Assigned user is not a member of this project",
      });
    }


    const task = await Task.create({

      title,

      description,

      dueDate,

      priority,

      assignedTo,

      project: projectId,

      createdBy: req.user._id,

    });


    res.status(201).json({
      message: "Task created successfully",
      task,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// GET PROJECT TASKS

const getProjectTasks = async (req, res) => {

  try {

    const project = await Project.findById(
      req.params.projectId
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (!isProjectMember(project, req.user._id)) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    const query = {
      project: req.params.projectId,
    };

    if (!isProjectAdmin(project, req.user._id)) {
      query.assignedTo = req.user._id;
    }

    const tasks = await Task.find(query);

    res.status(200).json(tasks);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// UPDATE TASK STATUS

const updateTaskStatus = async (req, res) => {

  try {

    const task = await Task.findById(
      req.params.id
    );


    if (!task) {

      return res.status(404).json({
        message: "Task not found",
      });

    }

    const project = await Project.findById(
      task.project
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (!isProjectMember(project, req.user._id)) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    const canUpdate =
      isProjectAdmin(project, req.user._id) ||
      (task.assignedTo &&
        task.assignedTo.toString() ===
          req.user._id.toString());

    if (!canUpdate) {
      return res.status(403).json({
        message: "You can update only assigned tasks",
      });
    }

    const allowedStatus = [
      "To Do",
      "In Progress",
      "Done",
    ];

    if (!allowedStatus.includes(req.body.status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }


    task.status = req.body.status;

    await task.save();


    res.status(200).json({
      message: "Task updated",
      task,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// DELETE TASK

const deleteTask = async (req, res) => {

  try {

    const task = await Task.findById(
      req.params.id
    );


    if (!task) {

      return res.status(404).json({
        message: "Task not found",
      });

    }


    const project = await Project.findById(
      task.project
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (!isProjectMember(project, req.user._id)) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    if (!isProjectAdmin(project, req.user._id)) {
      return res.status(403).json({
        message: "Only admin can delete this task",
      });
    }


    await task.deleteOne();


    res.status(200).json({
      message: "Task deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// UPDATE TASK (FIELDS)
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const project = await Project.findById(
      task.project
    );

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (!isProjectMember(project, req.user._id)) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    const canUpdate =
      isProjectAdmin(project, req.user._id) ||
      (task.assignedTo &&
        task.assignedTo.toString() ===
          req.user._id.toString());

    if (!canUpdate) {
      return res.status(403).json({
        message: "You can update only assigned tasks",
      });
    }

    const updatable = [
      "title",
      "description",
      "dueDate",
      "priority",
      "assignedTo",
    ];

    for (const key of updatable) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        if (key === "priority") {
          const allowed = ["Low", "Medium", "High"];
          if (req.body[key] && !allowed.includes(req.body[key])) {
            return res.status(400).json({
              message: "Invalid priority",
            });
          }
        }

        if (key === "assignedTo" && req.body[key]) {
          if (!isProjectMember(project, req.body[key])) {
            return res.status(400).json({
              message: "Assigned user is not a member of this project",
            });
          }
        }
        task[key] = req.body[key];
      }
    }

    await task.save();

    res.status(200).json({
      message: "Task updated",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  createTask,
  getProjectTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
