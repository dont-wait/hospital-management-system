import { describe, expect, test, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "@/app/(user)/page";

vi.mock("@/components/home/Banner", () => ({
  default: () => <div data-testid="banner">Banner</div>,
}));
vi.mock("@/components/home/FeaturesSection", () => ({
  default: () => <div data-testid="features">Features</div>,
}));
vi.mock("@/components/home/ServicesSection", () => ({
  default: () => <div data-testid="services">Services</div>,
}));
vi.mock("@/components/home/CTASection", () => ({
  default: () => <div data-testid="cta">CTA</div>,
}));

describe("2. Kiểm thử việc render DOM", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test("Page renders all sections", () => {
    render(<Page />);
    expect(screen.getByTestId("banner")).toBeDefined();
    expect(screen.getByTestId("features")).toBeDefined();
    expect(screen.getByTestId("services")).toBeDefined();
    expect(screen.getByTestId("cta")).toBeDefined();
  });
});
