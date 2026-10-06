import { afterEach, describe, expect, it } from "vitest";
import { isCurrentStorageKey, setLocalAccount, storageKey } from "@/lib/brand";
import { criarNota, listarNotas } from "@/lib/notes/store";

afterEach(() => setLocalAccount(null));
describe("local account separation", () => {
  it("does not merge notes from different accounts or guests", () => {
    criarNota();
    expect(listarNotas()).toHaveLength(1);
    setLocalAccount("user-a");
    expect(listarNotas()).toHaveLength(0);
    criarNota();
    const privateKey = storageKey("notas");
    setLocalAccount("user-b");
    expect(listarNotas()).toHaveLength(0);
    expect(isCurrentStorageKey(privateKey)).toBe(false);
    setLocalAccount("user-a");
    expect(listarNotas()).toHaveLength(1);
  });
  it("keeps appearance settings shared but exports only the current study data", () => {
    setLocalAccount("user-a");
    expect(storageKey("settings")).toBe("gravitymind:settings");
    expect(isCurrentStorageKey("gravitymind:account:user-b:notas")).toBe(false);
    expect(isCurrentStorageKey("gravitymind:account:user-a:notas")).toBe(true);
  });
});
