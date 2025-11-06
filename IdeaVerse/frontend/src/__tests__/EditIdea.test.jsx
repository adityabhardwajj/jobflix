import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import EditIdea from "../pages/EditIdea";
import API from "../api/axiosClient";

// Mock API
jest.mock("../api/axiosClient");

describe("EditIdea Component", () => {
  const mockUser = {
    _id: "user123",
    name: "Test User",
    email: "test@example.com",
    role: "creator",
  };

  const mockIdea = {
    _id: "idea123",
    title: "Test Idea",
    description: "This is a test idea description",
    tags: ["test", "idea"],
    createdBy: { _id: "user123" },
  };

  beforeEach(() => {
    API.get.mockResolvedValue({
      data: {
        success: true,
        data: mockIdea,
      },
    });
  });

  it("renders edit form", async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <EditIdea />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Edit Idea/i)).toBeInTheDocument();
    });
  });

  it("loads idea data", async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <EditIdea />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(API.get).toHaveBeenCalled();
    });
  });
});

