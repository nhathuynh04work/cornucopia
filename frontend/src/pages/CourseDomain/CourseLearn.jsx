import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";

import { useGetCourseForLearning } from "../../hooks/useCourseQuery";
import { useUpdateLessonProgress } from "../../hooks/useCourseMutation";

import CourseLearnHeader from "../../components/CourseLearn/CourseLearnHeader";
import CourseLearnSidebar from "../../components/CourseLearn/CourseLearnSidebar";
import CourseLearnContent from "../../components/CourseLearn/CourseLearnContent";
import CourseLearnTabs from "../../components/CourseLearn/CourseLearnTabs";

const CourseLearnLayout = ({
  course,
  initialLessonId,
  onToggleProgress,
  isUpdatingProgress,
}) => {
  const [currentLessonId, setCurrentLessonId] = useState(initialLessonId);

  const [openModules, setOpenModules] = useState(() => {
    const initialOpenState = {};
    if (course?.modules) {
      course.modules.forEach((m) => (initialOpenState[m.id] = true));
    }
    return initialOpenState;
  });

  // for mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const allLessons = useMemo(() => {
    if (!course || !course.modules) return [];
    return course.modules.flatMap((m) => m.lessons);
  }, [course]);

  const currentLesson = allLessons.find((l) => l.id === currentLessonId);
  const currentLessonIndex = allLessons.findIndex(
    (l) => l.id === currentLessonId
  );

  const completedLessonsCount = allLessons.filter((l) => l.isCompleted).length;
  const totalLessonsCount = allLessons.length;
  const progressPercentage =
    totalLessonsCount > 0
      ? (completedLessonsCount / totalLessonsCount) * 100
      : 0;

  const handleLessonChange = (lessonId) => {
    setCurrentLessonId(lessonId);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);

    const mainContent = document.getElementById("main-content-scroll");
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleModule = (modId) => {
    setOpenModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleNext = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      handleLessonChange(allLessons[currentLessonIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (currentLessonIndex > 0) {
      handleLessonChange(allLessons[currentLessonIndex - 1].id);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden font-sans">
      <CourseLearnHeader
        course={course}
        progress={progressPercentage}
        completedLessonsCount={completedLessonsCount}
        totalLessonsCount={totalLessonsCount}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex overflow-hidden relative">
        <main
          id="main-content-scroll"
          className="flex-1 overflow-y-auto hide-scrollbar bg-white w-full"
        >
          <div className="w-full">
            <CourseLearnContent
              currentLesson={currentLesson}
              currentLessonIndex={currentLessonIndex}
              totalLessons={totalLessonsCount}
              handlePrev={handlePrev}
              handleNext={handleNext}
            />

            <CourseLearnTabs
              course={course}
              allLessons={allLessons}
              totalLessonsCount={totalLessonsCount}
              currentLessonId={currentLesson?.id}
            />
          </div>
        </main>

        <CourseLearnSidebar
          course={course}
          openModules={openModules}
          toggleModule={toggleModule}
          currentLessonId={currentLessonId}
          handleLessonChange={handleLessonChange}
          handleToggleProgress={onToggleProgress}
          updateProgressMutation={{ isPending: isUpdatingProgress }}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
    </div>
  );
};

export default function CourseLearn() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const {
    data: course,
    isLoading,
    isError,
  } = useGetCourseForLearning(courseId);

  const updateProgressMutation = useUpdateLessonProgress();

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-gray-400 bg-white">
        <Loader2 className="w-10 h-10 animate-spin mb-3 text-purple-600" />
        <p>Đang tải nội dung khóa học...</p>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-8">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">
          Không tìm thấy nội dung
        </h2>
        <button
          onClick={() => navigate("/courses")}
          className="mt-4 text-purple-600 hover:underline"
        >
          Quay lại thư viện
        </button>
      </div>
    );
  }

  const allLessons = course.modules
    ? course.modules.flatMap((m) => m.lessons)
    : [];
  const firstUncompleted = allLessons.find((l) => !l.isCompleted);
  const initialLessonId = firstUncompleted
    ? firstUncompleted.id
    : allLessons[0]?.id;

  const handleToggleProgress = (lesson) => {
    updateProgressMutation.mutate({
      courseId: Number(courseId),
      moduleId: lesson.moduleId,
      lessonId: lesson.id,
      isCompleted: !lesson.isCompleted,
    });
  };

  return (
    <CourseLearnLayout
      key={course.id}
      course={course}
      initialLessonId={initialLessonId}
      onToggleProgress={handleToggleProgress}
      isUpdatingProgress={updateProgressMutation.isPending}
    />
  );
}
