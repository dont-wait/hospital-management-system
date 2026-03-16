import { describe, test, expect, vi, beforeEach } from "vitest";
import BillingPage from "@/app/(user)/patient/appointment-management/[[...slug]]/page";
import { notFound } from "next/navigation";
import { Billing } from "@/types";

// =============================================================================
// MOCK SETUP
// =============================================================================

vi.mock("next/navigation", () => ({
  notFound: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/services/server", () => ({
  BillingService: {
    getBillings: vi.fn(),
  },
}));

vi.mock("@/components/shared/Icon", () => ({
  default: ({ name }: { name: string }) => (
    <div data-testid={`icon-${name}`}>Icon</div>
  ),
}));

interface BillingListProps {
  billings: Billing[];
  totalPages: number;
}

vi.mock("@/components/patient/billing/BillingList", () => ({
  default: ({ billings, totalPages }: BillingListProps) => (
    <div data-testid="billing-list">
      <div data-testid="billing-count">{billings.length}</div>
      <div data-testid="total-pages">{totalPages}</div>
    </div>
  ),
}));

vi.mock("@/components/patient/billing/BillingDetail", () => ({
  default: () => <div data-testid="billing-detail">Billing Detail</div>,
}));

interface BillingDetailContainerProps {
  patientId: string;
  billingId: string;
}

vi.mock("@/components/patient/billing/BillingDetailContainer", () => ({
  default: ({ patientId, billingId }: BillingDetailContainerProps) => (
    <div data-testid="billing-detail-container">
      <div data-testid="patient-id">{patientId}</div>
      <div data-testid="billing-id">{billingId}</div>
    </div>
  ),
}));

// =============================================================================
// 1. UNIT TESTING
// =============================================================================
describe("1. UNIT TESTING - Kiểm thử logic NotFound", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Gọi notFound() khi slug là mảng rỗng", async () => {
    const params = Promise.resolve({ slug: [] });
    await BillingPage({ params });
    expect(notFound).toHaveBeenCalledTimes(1);
  });
});
