const LETTER_SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

// Ordena tallas de forma natural: numéricas de menor a mayor (35, 36, 40...),
// luego por letras (XS, S, M, L...) y al final el resto ("Única", "54mm"...).
const sizeRank = (size: string): [number, number, string] => {
  const n = Number(size.replace(",", "."));
  if (!isNaN(n)) return [0, n, size];
  const letter = LETTER_SIZES.indexOf(size.toUpperCase());
  if (letter !== -1) return [1, letter, size];
  return [2, 0, size];
};

export const sortVariants = <T extends { size: string }>(variants: T[]): T[] =>
  [...variants].sort((a, b) => {
    const [ga, na, sa] = sizeRank(a.size);
    const [gb, nb, sb] = sizeRank(b.size);
    return ga - gb || na - nb || sa.localeCompare(sb);
  });
