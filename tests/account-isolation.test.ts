import { afterEach, describe, expect, it } from "vitest";
import { isCurrentStorageKey, setLocalAccount, storageKey } from "@/lib/brand";
import { criarNota, desvincularNotasConversa, guardarNota, listarNotas } from "@/lib/notes/store";

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
  it("keeps saved tutor notes when a conversation is removed and isolates their backlinks", () => {
    setLocalAccount("user-a");
    const conversaId = crypto.randomUUID();
    const nota = {
      ...criarNota(),
      conversaId,
      titulo: "Inércia",
      conteudo: "Um corpo mantém seu movimento.",
    };
    guardarNota(nota);
    expect(listarNotas()[0]).toEqual(nota);
    setLocalAccount("user-b");
    expect(listarNotas()).toEqual([]);
    setLocalAccount("user-a");
    desvincularNotasConversa(conversaId);
    expect(listarNotas()[0]).toMatchObject({ titulo: nota.titulo, conteudo: nota.conteudo });
    expect(listarNotas()[0].conversaId).toBeUndefined();
  });
  it("rejects malformed conversation backlinks in notes", () => {
    const nota = { ...criarNota(), conversaId: "not-a-conversation" };
    expect(() => guardarNota(nota)).toThrow("Anotação inválida.");
  });
});
