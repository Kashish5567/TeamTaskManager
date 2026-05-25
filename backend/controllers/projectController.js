const Project = require("../models/Project");

const User = require("../models/User");


// ==========================================
// CREATE PROJECT
// ==========================================

const createProject = async (req, res) => {

  try {

    const {
      title,
      description,
    } = req.body;


    if (!title) {
      return res.status(400).json({
        message: "Project title is required",
      });
    }


    // CREATE PROJECT

    const project = await Project.create({

      title,

      description,

      admin: req.user._id,

      members: [req.user._id],

    });


    res.status(201).json({
      message: "Project created successfully",
      project,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};



// ==========================================
// GET USER PROJECTS
// ==========================================

const getProjects = async (req, res) => {

  try {

    const projects = await Project.find({

      members: req.user._id,

    })

    .populate("admin", "name email")

    .populate("members", "name email");


    res.status(200).json(projects);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};



// ==========================================
// ADD MEMBER
// ==========================================

const addMember = async (req, res) => {

  try {

    const { email } = req.body;

    const projectId = req.params.id;


    // FIND PROJECT

    const project = await Project.findById(
      projectId
    );


    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }


    // CHECK ADMIN

    if (
      project.admin.toString() !==
      req.user._id.toString()
    ) {

      return res.status(403).json({
        message: "Only admin can add members",
      });

    }


    // FIND USER

    const user = await User.findOne({
      email,
    });


    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }


    // CHECK EXISTING MEMBER

    const alreadyMember =
      project.members.includes(user._id);

    if (alreadyMember) {

      return res.status(400).json({
        message: "User already member",
      });

    }


    // ADD MEMBER

    project.members.push(user._id);

    await project.save();


    res.status(200).json({
      message: "Member added successfully",
      project,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};



// ==========================================
// REMOVE MEMBER
// ==========================================

const removeMember = async (req, res) => {

  try {

    const { userId } = req.body;

    const projectId = req.params.id;


    // FIND PROJECT

    const project = await Project.findById(
      projectId
    );


    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }


    // CHECK ADMIN

    if (
      project.admin.toString() !==
      req.user._id.toString()
    ) {

      return res.status(403).json({
        message: "Only admin can remove members",
      });

    }


    // REMOVE MEMBER

    project.members = project.members.filter(

      (member) =>
        member.toString() !== userId

    );


    await project.save();


    res.status(200).json({
      message: "Member removed successfully",
      project,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


module.exports = {
  createProject,
  getProjects,
  addMember,
  removeMember,
};