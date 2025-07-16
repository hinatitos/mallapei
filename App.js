
import React, { useState, useEffect } from "react";

const courses = [
  { name: "Política Educativa", semester: 1, prerequisites: [] },
  { name: "Fundamentos Sociológicos de la Educación", semester: 1, prerequisites: [] },
  { name: "Introducción a la Fonética", semester: 1, prerequisites: [] },
  { name: "Lingüística General I", semester: 2, prerequisites: [] },
  { name: "Fonética y Fonología", semester: 3, prerequisites: ["Introducción a la Fonética"] },
  { name: "Lingüística General II", semester: 4, prerequisites: ["Lingüística General I"] },
  { name: "Gramática Comparada", semester: 6, prerequisites: ["Lingüística General II"] },
  { name: "Lingüística Aplicada a la Enseñanza del Idioma Inglés", semester: 7, prerequisites: ["Gramática Comparada"] }
];

const Course = ({ course, completed, onClick, unlocked }) => (
  <div
    onClick={onClick}
    className={\`transition-all duration-300 cursor-pointer p-4 m-2 rounded-xl shadow-md text-base text-center select-none
      \${completed ? "line-through bg-pink-100 text-gray-400" : ""}
      \${!unlocked ? "opacity-30 cursor-not-allowed" : "hover:bg-pink-200"}
      \${unlocked && !completed ? "bg-pink-50 text-pink-800" : ""}\`}
    title={!unlocked ? \`Requiere: \${course.prerequisites.join(", ")}\` : "Toca para marcar/desmarcar"}
  >
    {course.name}
  </div>
);

const App = () => {
  const [completedCourses, setCompletedCourses] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("completedCourses");
    if (saved) {
      setCompletedCourses(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("completedCourses", JSON.stringify(completedCourses));
  }, [completedCourses]);

  const toggleCourse = (name) => {
    if (!isUnlocked(name)) return;
    setCompletedCourses((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const resetCourses = () => {
    if (window.confirm("¿Estás seguro de que quieres reiniciar la malla?")) {
      setCompletedCourses([]);
    }
  };

  const isUnlocked = (name) => {
    const course = courses.find((c) => c.name === name);
    return course.prerequisites.every((p) => completedCourses.includes(p));
  };

  return (
    <div className="p-4 font-sans bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-center text-pink-500 mb-4">
        Malla Pedagogía en Inglés
      </h1>
      <div className="flex justify-center mb-4">
        <button
          onClick={resetCourses}
          className="bg-pink-300 text-white px-4 py-2 rounded-full hover:bg-pink-400"
        >
          Reiniciar Malla
        </button>
      </div>
      {[...Array(10)].map((_, i) => (
        <div key={i} className="mb-4">
          <h2 className="text-xl font-semibold text-pink-500 mb-2">
            Semestre {i + 1}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {courses
              .filter((c) => c.semester === i + 1)
              .map((course) => (
                <Course
                  key={course.name}
                  course={course}
                  completed={completedCourses.includes(course.name)}
                  unlocked={isUnlocked(course.name)}
                  onClick={() => toggleCourse(course.name)}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
