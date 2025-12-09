import React from "react";
import { render, screen } from "@testing-library/react";
import UserCourseCard from "./UserCourseCard";

// 👇 Мокаем App Router из Next.js
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    prefetch: jest.fn(),
    // можно добавить ещё методы, если понадобится
  }),
}));

describe("UserCourseCard", () => {
  test("рендерит название курса", () => {
    render(
      <UserCourseCard
        slug="super-course"
        title="Супер курс"
        image="test.png"
        days="7 дней"
        time="15 мин"
        id="abc123"
      />
    );

    // Проверяем, что отображается заголовок
    expect(screen.getByText(/Супер курс/i)).toBeInTheDocument();
  });
});
