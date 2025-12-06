import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthForm from "./AuthForm";

// Мокаем роутер
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

// Мокаем useAuth из контекста
const loginMock = jest.fn();
jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    login: loginMock,
  }),
}));

// Мокаем axios
jest.mock("axios", () => ({
  post: jest.fn(),
}));
import axios from "axios";

describe("AuthForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("успешный логин", async () => {
    const onCloseMock = jest.fn();
    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: { token: "FAKE_TOKEN" },
    });

    render(<AuthForm onClose={onCloseMock} />);

    // Находим и заполняем поля
    fireEvent.change(screen.getByPlaceholderText(/логин/i), {
      target: { value: "test@mail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/пароль/i), {
      target: { value: "Abcd12!@" },
    });

    fireEvent.submit(screen.getByTestId("form-test"));
    screen.getByRole("button", { name: /войти/i });

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith("test@mail.com", "FAKE_TOKEN");
      expect(onCloseMock).toHaveBeenCalled();
      expect(pushMock).toHaveBeenCalledWith("/Fitness/Main");
    });
  });

  test("ошибка при невалидном email", async () => {
    const onCloseMock = jest.fn();

    render(<AuthForm onClose={onCloseMock} />);

    fireEvent.change(screen.getByPlaceholderText(/логин/i), {
      target: { value: "неправильный_мейл" },
    });
    fireEvent.change(screen.getByPlaceholderText(/пароль/i), {
      target: { value: "Abcd12!@" },
    });
    fireEvent.submit(screen.getByTestId("form-test"));
    screen.getByRole("button", { name: /войти/i });

    await waitFor(() => {
      expect(screen.getByTestId("email-error")).toHaveTextContent(
        /корректный email/i
      );
    });

    expect(loginMock).not.toHaveBeenCalled();
    expect(onCloseMock).not.toHaveBeenCalled();
  });
});
