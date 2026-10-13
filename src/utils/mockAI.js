import { diseases } from "../data/diseases";
export function analyzeImage(file) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const seed = (file.name + file.size).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
      const idx = seed % diseases.length;
      const picked = diseases[idx];
      const confidence = 0.78 + ((seed % 17) / 100);
      resolve({ disease: picked, confidence: Math.min(confidence, 0.97) });
    }, 1800);
  });
}
