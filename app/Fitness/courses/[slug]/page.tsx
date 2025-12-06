"use client";
import { use } from "react";
import CourseDescrContainer from "@/components/CourseDescrContainer/CourseDescrContainer";
import { useAuth } from "@/context/AuthContext";

const courses = [
  {
    slug: "yoga",
    cardSrc: "/skillcard1.svg",
    cardSrcMobile: "/YogaCard.svg",
    fitForItems: [
      "Давно хотели попробовать йогу, но не решались начать",
      "Хотите укрепить позвоночник, избавиться от болей в спине и суставах",
      "Ищете активность, полезную для тела и души",
    ],
    directions: [
      "Йога для новичков",
      "Классическая йога",
      "Кундалини-йога",
      "Йогатерапия",
      "Хатха-йога",
      "Аштанга-йога",
    ],
  },
  {
    slug: "stretching",
    cardSrc: "/skillcard2.svg",
    cardSrcMobile: "/Course2.svg",
    fitForItems: [
      "Хотите стать гибче",
      "Ищете способ восстановиться после тренировки",
      "Хотите снизить травматизм",
    ],
    directions: [
      "Общий стрейчинг",
      "Динамическая растяжка",
      "Растяжка спины",
      "Растяжка на шпагат",
      "Расслабляющая растяжка",
    ],
  },
  {
    slug: "fitness",
    cardSrc: "/skillcard3.svg",
    cardSrcMobile: "/Course3.svg",
    fitForItems: [
      "Желаете укрепить сердечно-сосудистую систему",
      "Хотите улучшить фигуру и увеличить выносливость",
      "Ищете энергичный вид спорта",
    ],
    directions: [
      "Функциональный тренинг",
      "Кардиотренировки",
      "Силовой фитнес",
      "Круговые тренировки",
      "Интервальные тренировки",
    ],
  },
  {
    slug: "step-aerobics",
    cardSrc: "/skillcard4.svg",
    cardSrcMobile: "/Course4.svg",
    fitForItems: [
      "Хотите прокачать все группы мышц",
      "Любите динамичные групповые тренировки",
      "Ищете эффективное жиросжигание",
    ],
    directions: [
      "Классический степ",
      "Продвинутый степ",
      "Силовой степ",
      "Фитнес-микс",
    ],
  },
  {
    slug: "bodyflex",
    cardSrc: "/skillcard5.svg",
    cardSrcMobile: "/Course5.svg",
    fitForItems: [
      "Хотите подтянуть силуэт и снизить вес",
      "Интересует дыхательная гимнастика",
      "Ищете мягкую и безопасную нагрузку для себя",
    ],
    directions: [
      "Bodyflex для похудения",
      "Дыхательные практики",
      "Мягкая гимнастика",
      "Bodyflex для начинающих",
    ],
  },
];
export default function Page({ params }) {
  const readyParams = use(params) as { slug: string | string[] };
  const { isAuth } = useAuth();
  const slug = Array.isArray(readyParams.slug)
    ? readyParams.slug[0]
    : readyParams.slug;
  const course = courses.find((c) => c.slug === slug);

  if (!course) return null;

  return (
    <CourseDescrContainer
      desktopImage={course.cardSrc}
      mobileImage={course.cardSrcMobile}
      fitForItems={course.fitForItems}
      directions={course.directions}
      isAuth={isAuth}
    />
  );
}
