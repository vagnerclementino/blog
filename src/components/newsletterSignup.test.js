import React from "react"
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react"
import NewsletterSignup from "./newsletterSignup"

// Mock the fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ message: "Mocked success response" }),
    ok: true,
  })
)

describe("NewsletterSignup", () => {
  beforeEach(() => {
    // Reset mocks before each test
    fetch.mockClear();
    // Mock fetch to return a default successful response
    fetch.mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve({ message: "Mocked success response" }),
        ok: true,
      })
    );
  });

  it("renders newsletter signup form with name and email fields", () => {
    render(<NewsletterSignup />);
    
    expect(screen.getByText("📬 Newsletter")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome completo")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("seu@email.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Assinar" })).toBeInTheDocument();
    expect(screen.getByText(/Receba as últimas atualizações/)).toBeInTheDocument();
  });

  it("shows success message when valid name and email are submitted", async () => {
    render(<NewsletterSignup />);
    
    const nameInput = screen.getByLabelText("Nome completo");
    const emailInput = screen.getByPlaceholderText("seu@email.com");
    const submitButton = screen.getByRole("button", { name: "Assinar" });
    
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      // Check if fetch was called with correct data
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        "/api/newsletter-signup",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ name: "John Doe", email: "test@example.com" }),
        })
      );
      expect(screen.getByText("Sucesso! Verifique seu email.")).toBeInTheDocument();
    });
    
    // Verify inputs are cleared
    expect(nameInput.value).toBe("");
    expect(emailInput.value).toBe("");
  });

  it("shows error message when empty name or email is submitted", async () => {
    render(<NewsletterSignup />);
    
    const nameInput = screen.getByLabelText("Nome completo");
    const emailInput = screen.getByPlaceholderText("seu@email.com");
    const submitButton = screen.getByRole("button", { name: "Assinar" });

    // Test with empty name and valid email
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);
    await waitFor(() => expect(screen.getByText("Por favor, preencha nome e email")).toBeInTheDocument());

    // Test with valid name and empty email
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "" } });
    fireEvent.click(submitButton);
    await waitFor(() => expect(screen.getByText("Por favor, preencha nome e email")).toBeInTheDocument());

    // Test with both empty
    fireEvent.change(nameInput, { target: { value: "" } });
    fireEvent.change(emailInput, { target: { value: "" } });
    fireEvent.click(submitButton);
    await waitFor(() => expect(screen.getByText("Por favor, preencha nome e email")).toBeInTheDocument());
  });

  it("clears status message and inputs after successful submission and timeout", async () => {
    jest.useFakeTimers();
    
    render(<NewsletterSignup />);
    
    const nameInput = screen.getByLabelText("Nome completo");
    const emailInput = screen.getByPlaceholderText("seu@email.com");
    const submitButton = screen.getByRole("button", { name: "Assinar" });
    
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText("Sucesso! Verifique seu email.")).toBeInTheDocument();
      expect(nameInput.value).toBe("");
      expect(emailInput.value).toBe("");
    });
    
    // Fast forward 3 seconds to clear status and inputs
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    await waitFor(() => {
      expect(screen.queryByText("Sucesso! Verifique seu email.")).not.toBeInTheDocument();
      expect(screen.queryByText("Por favor, preencha nome e email")).not.toBeInTheDocument();
    });
    
    jest.useRealTimers();
  });

  it("handles API connection error", async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error("API connection error")));
    
    render(<NewsletterSignup />);
    
    const nameInput = screen.getByLabelText("Nome completo");
    const emailInput = screen.getByPlaceholderText("seu@email.com");
    const submitButton = screen.getByRole("button", { name: "Assinar" });
    
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText("Erro de conexão!")).toBeInTheDocument();
    });
  });

  it("handles API error response", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ message: "User already subscribed" }),
        ok: false,
      })
    );
    
    render(<NewsletterSignup />);
    
    const nameInput = screen.getByLabelText("Nome completo");
    const emailInput = screen.getByPlaceholderText("seu@email.com");
    const submitButton = screen.getByRole("button", { name: "Assinar" });
    
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText("User already subscribed")).toBeInTheDocument();
    });
  });

  it("displays disclaimer about demo functionality", () => {
    render(<NewsletterSignup />);
    
    expect(screen.getByText(/Esta é uma funcionalidade demonstrativa/)).toBeInTheDocument();
  });
});