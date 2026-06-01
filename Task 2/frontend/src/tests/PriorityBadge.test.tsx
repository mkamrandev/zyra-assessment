import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PriorityBadge } from "../components/PriorityBadge";

describe("PriorityBadge", () => {
    it("renders the correct label for each priority", () => {
        const cases = [
            { priority: "urgent", label: "Urgent" },
            { priority: "high", label: "High" },
            { priority: "medium", label: "Medium" },
            { priority: "low", label: "Low" },
        ] as const;

        cases.forEach(({ priority, label }) => {
            const { unmount } = render(<PriorityBadge priority={priority} />);
            expect(screen.getByText(label)).toBeInTheDocument();
            unmount();
        });
    });

    it("applies red styles for urgent priority", () => {
        render(<PriorityBadge priority="urgent" />);
        const badge = screen.getByText("Urgent");
        expect(badge.className).toMatch(/red/);
    });

    it("applies green-free (non-red) styles for low priority", () => {
        render(<PriorityBadge priority="low" />);
        const badge = screen.getByText("Low");
        expect(badge.className).not.toMatch(/red/);
    });
});
