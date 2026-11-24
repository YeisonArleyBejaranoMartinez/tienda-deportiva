---
name: tienda-animaciones
description: Usar para crear animaciones muy visuales y llamativas en la tienda deportiva con Motion (Framer Motion) y, para scroll avanzado, GSAP.
---

# Animaciones llamativas para la tienda deportiva

La tienda es de patines, patinetas y protecciones: el tono es urbano, rápido y con energía. Las animaciones deben transmitir velocidad y movimiento, sin estorbar la compra.

## Qué librería usar

- **Motion (antes Framer Motion)** por defecto: es la opción natural para React 19 / Next.js 16. Instalar `npm i motion` e importar de `motion/react`.
- **GSAP** solo para secuencias de scroll complejas (hero con pin, timelines largos, scrub). Instalar `npm i gsap @gsap/react` y usar el hook `useGSAP`. Registrar `ScrollTrigger` una sola vez.
- No mezclar las dos en el mismo componente.

## Reglas con Next.js App Router

- Toda animación vive en un Client Component (`"use client"`). Crear envoltorios pequeños en `src/components/motion/` (p. ej. `FadeInSection`, `StaggerGrid`, `MagneticButton`) y usarlos desde Server Components pasando `children`.
- Animar solo `transform` y `opacity` (x, y, scale, rotate) para 60 fps; evitar animar `width`, `height`, `top`, `left` o sombras grandes.
- Respetar accesibilidad: `useReducedMotion()` de Motion (o `gsap.matchMedia()` con `(prefers-reduced-motion: reduce)`) y reducir a un simple fade.
- No bloquear la interacción: botones de compra y selector de talla deben responder al instante.
- Para GSAP: limpiar con `useGSAP` (hace `revert` automático) y usar `scope` con un `ref`.

## Recetas listas

### Entrada al hacer scroll
```tsx
"use client";
import { motion, useReducedMotion } from "motion/react";

export const FadeInSection = ({ children }: { children: React.ReactNode }) => {
  const reduce = useReducedMotion();
  return (
    <motion.section
      initial={{ opacity: 0, y: reduce ? 0 : 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
    >
      {children}
    </motion.section>
  );
};
```

### Grilla de productos en cascada
```tsx
const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 40, rotate: -2 }, show: { opacity: 1, y: 0, rotate: 0 } };
// <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
//   {products.map(p => <motion.div key={p.id} variants={item}><ProductGridItem product={p} /></motion.div>)}
```

### Tarjeta con inclinación 3D al pasar el mouse
Usar `useMotionValue` + `useTransform` para mapear la posición del puntero a `rotateX`/`rotateY` (±10°), con `style={{ transformPerspective: 800 }}` y `whileHover={{ scale: 1.04 }}`.

### Agregar al carrito con "vuelo" al ícono
- Usar `layoutId` compartido o clonar la miniatura y animar `x`/`y`/`scale` hacia la posición del ícono del carrito (`getBoundingClientRect`).
- Al llegar, hacer "pop" del contador: `animate={{ scale: [1, 1.4, 1] }}` y una pequeña vibración `rotate: [0, -12, 12, 0]`.

### Selector de talla
- Indicador deslizante con `layoutId="talla-activa"` detrás del botón seleccionado.
- `whileTap={{ scale: 0.9 }}` en cada talla; tallas sin stock sin animación y deshabilitadas.

### Hero estilo skate (GSAP)
- `ScrollTrigger` con `pin: true` y `scrub: 1`: la patineta/patín cruza la pantalla en diagonal (`x`, `rotate`), el título aparece letra por letra y el fondo hace parallax.
- Texto con efecto "speed lines": pseudo-elementos con `skewX(-20deg)` animados en `x`.

### Transiciones entre páginas
- `AnimatePresence` en un template (`src/app/(shop)/template.tsx`) con fade + slide corto (≤ 300 ms).

### Micro-interacciones
- Botones magnéticos (siguen el cursor unos px), contador de stock que hace `animate` de número, badges "¡Últimas unidades!" con pulso suave, confeti/partículas al confirmar la orden.

## Guía de tiempos

- Micro-interacciones: 150–250 ms. Entradas de sección: springs (`stiffness` 100–200, `damping` 15–25). Hero y secuencias: hasta 1–1.5 s con scrub.
- Máximo una animación "protagonista" por pantalla; el resto, sutil.

## Antes de terminar

- Probar con "Reducir movimiento" activado en el sistema.
- Revisar en móvil que no haya saltos de layout (CLS) ni scroll horizontal.
- `npm run lint` sin errores.
