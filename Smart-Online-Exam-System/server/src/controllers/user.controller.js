const prisma = require(
  "../lib/prisma"
);

const profile = async (
  req,
  res
) => {
  try {
    const user =
      await prisma.user.findUnique({
        where: {
          id: req.user.id,
        },

        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          avatar: true,
          role: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    if (!user) {
      return res
        .status(404)
        .json({
          success: false,
          message:
            "User profile not found.",
        });
    }

    return res
      .status(200)
      .json({
        success: true,
        message:
          "Profile fetched successfully.",
        data: user,
      });
  } catch (error) {
    console.error(
      "GET PROFILE ERROR:",
      error
    );

    return res
      .status(500)
      .json({
        success: false,
        message:
          "Unable to fetch profile.",
      });
  }
};

const updateProfile = async (
  req,
  res
) => {
  try {
    const {
      firstName,
      lastName,
      phone,
    } = req.body;

    const trimmedFirstName =
      firstName?.trim();

    const trimmedLastName =
      lastName?.trim();

    const trimmedPhone =
      phone?.trim();

    if (
      !trimmedFirstName ||
      !trimmedLastName
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "First name and last name are required.",
        });
    }

    if (
      trimmedFirstName.length >
        50 ||
      trimmedLastName.length >
        50
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "First name and last name cannot exceed 50 characters.",
        });
    }

    if (
      trimmedPhone &&
      !/^[0-9+\-\s()]{7,20}$/.test(
        trimmedPhone
      )
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Please enter a valid phone number.",
        });
    }

    const updatedUser =
      await prisma.user.update({
        where: {
          id: req.user.id,
        },

        data: {
          firstName:
            trimmedFirstName,

          lastName:
            trimmedLastName,

          phone:
            trimmedPhone || null,
        },

        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          avatar: true,
          role: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    return res
      .status(200)
      .json({
        success: true,
        message:
          "Profile updated successfully.",
        data: updatedUser,
      });
  } catch (error) {
    console.error(
      "UPDATE PROFILE ERROR:",
      error
    );

    return res
      .status(500)
      .json({
        success: false,
        message:
          "Unable to update profile.",
      });
  }
};

const adminDashboard = async (
  req,
  res
) => {
  return res
    .status(200)
    .json({
      success: true,
      message:
        "Welcome Admin",
    });
};

module.exports = {
  profile,
  updateProfile,
  adminDashboard,
};