const prisma = require("../models/prisma");
const createError = require("../utils/create-error");

exports.createTask = async (req, res, next) => {
  try {
    const { task, status, dueDate } = req.body;
    const { id } = req.user;

    const createdAt = new Date();
    const createdTask = await prisma.task.create({
      data: {
        task,
        createdAt,
        status,
        userId: id,
        dueDate,
      },
    });

    res.status(201).json({ createdTask });
  } catch (err) {
    next(err);
  }
};

exports.getTaskByUserId = async (req, res, next) => {
  try {
    const { id } = req.user;

    const tasks = await prisma.task.findMany({
      where: {
        userId: id,
      },
    });

    if (!tasks) {
      return next(createError("This user doesn't have any task", 404));
    }

    res.status(200).json({ tasks });
  } catch (err) {
    next(err);
  }
};

exports.updatedTask = async (req, res, next) => {
  try {
    const data = req.body;
    const { taskId } = req.params;

    const updatedAt = new Date();
    const updatedTask = await prisma.task.update({
      data: {
        task: data.task,
        createdAt: data.createdAt,
        editedAt: updatedAt,
        status: data.status,
        dueDate: data.dueDate,
      },
      where: {
        id: +taskId,
      },
    });
    res.status(200).json({ updatedTask });
  } catch (err) {
    next(err);
  }
};

exports.deletedTask = async (req, res, next) => {
  try {
    await prisma.task.delete({
      where: {
        id: +req.params.taskId,
      },
    });
    res.status(200).json({ msg: "deleted" });
  } catch (err) {
    next(err);
  }
};
