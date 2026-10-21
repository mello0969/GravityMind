import { afterEach, expect, it } from "vitest";
import { setLocalAccount } from "@/lib/brand";
import { collectLocalData } from "@/lib/settings/data-export";

afterEach(() => setLocalAccount(null));
it("exports only the current account and device preferences", () => {
  setLocalAccount("student-a");
  localStorage.setItem("gravitymind:settings", '{"theme":"dark"}');
  localStorage.setItem("gravitymind:account:student-a:notes", '["my note"]');
  localStorage.setItem("gravitymind:account:student-b:notes", '["private"]');
  localStorage.setItem("gravitymind:notes", '["guest"]');
  localStorage.setItem("other-app", "private");
  expect(collectLocalData(localStorage)).toEqual({
    "gravitymind:settings": { theme: "dark" },
    "gravitymind:account:student-a:notes": ["my note"],
  });
});
it("exports guest data without including registered accounts", () => {
  setLocalAccount(null);
  localStorage.setItem("gravitymind:notes", "legacy raw text");
  localStorage.setItem("gravitymind:account:student-a:notes", '["private"]');
  expect(collectLocalData(localStorage)).toEqual({ "gravitymind:notes": "legacy raw text" });
});
