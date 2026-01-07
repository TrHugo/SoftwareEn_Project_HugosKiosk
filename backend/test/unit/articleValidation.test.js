import { describe, it, expect } from "vitest";
import { isValidArticle } from "../../src/utils/articleValidation.js";

describe("isValidArticle", () => {
  

  it("returns true for a valid article object", () => {
    const article = { 
      id: 1, 
      publisher_id: 10, 
      title: "Super Titre", 
      content: "Contenu intéressant" 
    };
    expect(isValidArticle(article)).toBe(true);
  });

  it("returns false if id is missing", () => {
    const article = { 
      publisher_id: 10, 
      title: "Titre", 
      content: "Contenu" 
    };
    expect(isValidArticle(article)).toBe(false);
  });

  it("returns false if id is not a number", () => {
    const article = { 
      id: "1", 
      publisher_id: 10, 
      title: "Titre", 
      content: "Contenu" 
    };
    expect(isValidArticle(article)).toBe(false);
  });

  it("returns false if publisher_id is not a number", () => {
    const article = { 
      id: 1, 
      publisher_id: "DIX", 
      title: "Titre", 
      content: "Contenu" 
    };
    expect(isValidArticle(article)).toBe(false);
  });

  it("returns false if title is missing", () => {
    const article = { 
      id: 1, 
      publisher_id: 10, 
      content: "Contenu" 
    };
    expect(isValidArticle(article)).toBe(false);
  });

  it("returns false if title is not a string", () => {
    const article = { 
      id: 1, 
      publisher_id: 10, 
      title: 123, 
      content: "Contenu" 
    };
    expect(isValidArticle(article)).toBe(false);
  });

  // 5. Test global (null/undefined)
  it("returns false if data is null or undefined", () => {
    expect(isValidArticle(null)).toBe(false);
    expect(isValidArticle(undefined)).toBe(false);
  });
});