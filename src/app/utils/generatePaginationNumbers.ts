//[1,2,3,4,5,.....,7]
export const generatePaginationNumbers = (
  currentPage: number,
  totalPages: number,
) => {
  //si el numero total de paginas  es 7 o menos  vamos a mostrar todas las paginas sin puntos suspensivos
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  //si la pagina  actual esta entre las primeras 3 paginas , mostramos las primeras 3, luego puntos suspensivos y las 2 ultimas paginas
  if (totalPages <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }
  //si la pagina actual esta enrtre las ultimas 3 paginas , mostraremos las 2 primeras paginas, luego los puntos suspensivos y las ultimas 3 paginas

  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }
  //si la  pagina actual esta en otro lugar medio, mostraremos  la primera pagina , luego los puntos suspensivos, luego la pagina actual y luego mas puntos suspensivos
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};
