import Application, { APPLICATION_STATUSES } from "../models/Application.js";

const normalizeTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildQuery = (req) => {
  const { status, priority, jobType, search } = req.query;
  const query = { user: req.user._id };

  if (status && status !== "All") {
    query.status = status;
  }

  if (priority && priority !== "All") {
    query.priority = priority;
  }

  if (jobType && jobType !== "All") {
    query.jobType = jobType;
  }

  if (search) {
    const regex = new RegExp(escapeRegex(search), "i");
    query.$or = [
      { company: regex },
      { position: regex },
      { location: regex },
      { source: regex },
      { tags: regex }
    ];
  }

  return query;
};

const getSort = (sort = "newest") => {
  const sortOptions = {
    newest: "-createdAt",
    oldest: "createdAt",
    applied: "-appliedDate",
    company: "company",
    status: "status"
  };

  return sortOptions[sort] || sortOptions.newest;
};

export const getApplications = async (req, res, next) => {
  try {
    const applications = await Application.find(buildQuery(req)).sort(getSort(req.query.sort));
    res.json(applications);
  } catch (error) {
    next(error);
  }
};

export const getApplicationStats = async (req, res, next) => {
  try {
    const [statusCounts, total] = await Promise.all([
      Application.aggregate([
        { $match: { user: req.user._id } },
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),
      Application.countDocuments({ user: req.user._id })
    ]);

    const byStatus = APPLICATION_STATUSES.reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {});

    statusCounts.forEach((item) => {
      byStatus[item._id] = item.count;
    });

    res.json({ total, byStatus });
  } catch (error) {
    next(error);
  }
};

export const createApplication = async (req, res, next) => {
  try {
    const application = await Application.create({
      ...req.body,
      tags: normalizeTags(req.body.tags),
      user: req.user._id
    });

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

export const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!application) {
      const error = new Error("Application not found.");
      error.statusCode = 404;
      throw error;
    }

    res.json(application);
  } catch (error) {
    next(error);
  }
};

export const updateApplication = async (req, res, next) => {
  try {
    const update = { ...req.body };

    if (Object.prototype.hasOwnProperty.call(req.body, "tags")) {
      update.tags = normalizeTags(req.body.tags);
    }

    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      update,
      { new: true, runValidators: true }
    );

    if (!application) {
      const error = new Error("Application not found.");
      error.statusCode = 404;
      throw error;
    }

    res.json(application);
  } catch (error) {
    next(error);
  }
};

export const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!application) {
      const error = new Error("Application not found.");
      error.statusCode = 404;
      throw error;
    }

    res.json({ message: "Application deleted.", id: req.params.id });
  } catch (error) {
    next(error);
  }
};
