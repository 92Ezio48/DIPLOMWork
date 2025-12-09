"use client";
import { useEffect, useState, use } from "react";
import CourseDescrContainer from "@/components/CourseDescrContainer/CourseDescrContainer";
import { useAuth } from "@/context/AuthContext";

const courses = [
  {
    slug: "yoga",
    _id: "ab1c3f",
    cardSrc: "/skillcard1.svg",
    cardSrcMobile: "/YogaCard.svg",
  },
  {
    slug: "stretching",
    _id: "kfpq8e",
    cardSrc: "/skillcard2.svg",
    cardSrcMobile: "/Course2.svg",
  },
  {
    slug: "fitness",
    _id: "ypox9r",
    cardSrc: "/skillcard3.svg",
    cardSrcMobile: "/Course3.svg",
  },
  {
    slug: "step-aerobics",
    _id: "6i67sm",
    cardSrc: "/skillcard4.svg",
    cardSrcMobile: "/Course4.svg",
  },
  {
    slug: "bodyflex",
    _id: "q02a6i",
    cardSrc: "/skillcard5.svg",
    cardSrcMobile: "/Course5.svg",
  },
];

export default function Page({ params }) {
  const readyParams = use(params) as { slug: string | string[] };
  const [directions, setDirections] = useState([]);
  const [fittings, setFittings] = useState([]);
  const { isAuth } = useAuth();
  const slug = Array.isArray(readyParams.slug)
    ? readyParams.slug[0]
    : readyParams.slug;
  const course = courses.find((c) => c.slug === slug);

  useEffect(() => {
    if (!course?._id) return;
    fetch(`https://wedev-api.sky.pro/api/fitness/courses/${course._id}`)
      .then((r) => r.json())
      .then((data) => {
        setDirections(data.directions || []);
        setFittings(data.fitting || []);
      })
      .catch(console.error);
  }, [course?._id]);

  if (!course) return null;

  return (
    <CourseDescrContainer
      desktopImage={course.cardSrc}
      mobileImage={course.cardSrcMobile}
      fitForItems={fittings}
      directions={directions}
      isAuth={isAuth}
      courseId={course._id}
    />
  );
}
