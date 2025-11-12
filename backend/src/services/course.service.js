import { ContentStatus, CourseStatus } from "../generated/prisma/index.js";
import prisma from "../prisma.js";
import * as courseRepo from "../repositories/course.repository.js";
import * as moduleRepo from "../repositories/module.repository.js";
import { ForbiddenError, NotFoundError } from "../utils/AppError.js";
import { defaults } from "../utils/constants.js";
import { reindexOneCourse } from "../chatbot/course.indexer.helpers.js";

export async function getAll() {
  return prisma.course.findMany({
    where: {
      status: CourseStatus.PUBLIC,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
      _count: {
        select: { enrollments: true },
      },
    },
  });
}

export async function getCourseForInfoView(courseId) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      coverUrl: true,
      status: true,
      userId: true,
      user: {
        select: { id: true, name: true, avatarUrl: true },
      },
      modules: {
        where: { status: ContentStatus.PUBLIC },
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          title: true,
          lessons: {
            where: { status: ContentStatus.PUBLIC },
            orderBy: { sortOrder: "asc" },
            select: {
              id: true,
              title: true,
              duration: true,
              type: true,
            },
          },
        },
      },
      _count: {
        select: { enrollments: true },
      },
    },
  });

  if (!course) {
    throw new NotFoundError("Course not found");
  }

  return course;
}

export async function getCourseForEditor(courseId, userId) {
  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      userId: userId,
    },
  });

  if (!course) {
    throw new ForbiddenError("You do not have permission to edit this course.");
  }

  return prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { sortOrder: "asc" },
        include: {
          lessons: {
            orderBy: { sortOrder: "asc" },
          },
        },
      },
      _count: { select: { enrollments: true } },
    },
  });
}

export async function getCourseForLearning(courseId, userId) {
  const accessCheck = await prisma.course.findFirst({
    where: {
      id: courseId,
      OR: [
        {
          userId: userId,
        },
        {
          enrollments: {
            some: {
              userId: userId,
            },
          },
        },
      ],
    },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!accessCheck) {
    throw new ForbiddenError(
      "You are not enrolled in this course or do not own it."
    );
  }

  const isOwner = accessCheck.userId === userId;
  const contentWhereClause = isOwner ? {} : { status: ContentStatus.PUBLIC };

  return prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        where: contentWhereClause,
        orderBy: { sortOrder: "asc" },
        include: {
          lessons: {
            where: contentWhereClause,
            orderBy: { sortOrder: "asc" },
            include: {
              progress: {
                where: {
                  userId: userId,
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function getEnrolledCourses(userId) {
  return prisma.course.findMany({
    where: {
      enrollments: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
      _count: {
        select: { enrollments: true },
      },
    },
  });
}

export async function getMyCourses(userId) {
  return prisma.course.findMany({
    where: {
      userId: userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
      _count: {
        select: { enrollments: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getUserCourseEnrollment(courseId, userId) {
  const enrollment = await prisma.userCourseEnrollment.findFirst({
    where: { courseId: courseId, userId: userId },
  });

  return enrollment ? enrollment : null;
}

export async function create(data) {
  const createCoursePayload = {
    ...data,
    modules: { create: { title: "First module" } },
  };
  const course = await courseRepo.create(createCoursePayload);

  // 🔹 Khi tạo xong → nếu PUBLIC thì index
  try {
    await reindexOneCourse(course.id);
  } catch (e) {
    console.warn("reindexOneCourse(create) failed:", e?.message || e);
  }
  return course;
}

export async function update(courseId, data) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      _count: {
        select: { enrollments: true },
      },
    },
  });

  if (!course) {
    throw new NotFoundError("Course not found");
  }

  const hasEnrollments = course._count.enrollments > 0;

  if (data.status && data.status !== course.status) {
    if (data.status === "DRAFT" && hasEnrollments) {
      throw new ForbiddenError(
        "A course with enrolled students cannot be moved to draft. Please unlist it instead to prevent new enrollments."
      );
    }
  }

  const updated = await prisma.course.update({
    where: { id: courseId },
    data,
  });

  // 🔹 Sau update → index lại (nếu public thì tạo, không public thì xoá)
  try {
    await reindexOneCourse(updated.id);
  } catch (e) {
    console.warn("reindexOneCourse(update) failed:", e?.message || e);
  }

  return updated;
}

export async function remove(courseId, userId) {
  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      userId: userId,
    },
    include: {
      _count: {
        select: { enrollments: true },
      },
    },
  });

  if (!course) {
    throw new ForbiddenError(
      "You do not have permission to delete this course."
    );
  }

  const hasEnrollments = course._count.enrollments > 0;
  if (hasEnrollments) {
    throw new ForbiddenError(
      "Cannot delete a course with enrolled students. Please unlist it instead."
    );
  }

  await prisma.course.delete({
    where: { id: courseId },
  });

  return { message: "Course deleted successfully." };
}

export async function addModule(courseId) {
  const course = await courseRepo.findById(courseId);
  if (!course) throw new NotFoundError("Course not found");

  return moduleRepo.create({ courseId, ...defaults.MODULE_INFO });
}
