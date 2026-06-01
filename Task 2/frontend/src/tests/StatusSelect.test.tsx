import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { StatusSelect } from "../components/StatusSelect";

describe("StatusSelect", () => {
    it("renders with the current value selected", () => {
        render(<StatusSelect value="in_progress" onChange={vi.fn()} />);
        const select = screen.getByRole("combobox") as HTMLSelectElement;
        expect(select.value).toBe("in_progress");
    });

    it("calls onChange with the new value when user changes selection", async () => {
        const onChange = vi.fn();
        render(<StatusSelect value="todo" onChange={onChange} />);

        await userEvent.selectOptions(screen.getByRole("combobox"), "completed");
        expect(onChange).toHaveBeenCalledWith("completed");
    });

    it("is disabled when the disabled prop is true", () => {
        render(<StatusSelect value="todo" onChange={vi.fn()} disabled />);
        expect(screen.getByRole("combobox")).toBeDisabled();
    });

    it("shows all three status options", () => {
        render(<StatusSelect value="todo" onChange={vi.fn()} />);
        expect(screen.getByRole("option", { name: "To Do" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "In Progress" })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: "Completed" })).toBeInTheDocument();
    });
});
