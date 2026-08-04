# Brief Visual · LaserMed

**Inspiración:** Apple iPhone (clean focus) · Neauvia (editorial + acento) · Aesop (lujo silencioso) · Glossier (amigable) · The Row (minimalismo absoluto)
**Tono:** Quiet luxury · Cuidado · Luz · Método
**Estilo:** minimalismo cálido, mucho aire, motion sutil, paleta neutra con un acento definido.

---

## 1. Paleta de color

### Base
| Token | HEX | Uso |
|-------|-----|-----|
| `--lm-bg` | `#F5F1EA` | Fondo principal, marfil cálido (estilo Aesop) |
| `--lm-bg-2` | `#EDE6D7` | Fondo alterno, beige arena |
| `--lm-bg-dark` | `#161412` | Fondo en secciones "dark" |
| `--lm-ink` | `#1A1815` | Texto principal (negro cálido, no puro) |
| `--lm-ink-2` | `#5C574F` | Texto secundario, captions |
| `--lm-ink-3` | `#8C857B` | Texto auxiliar, metadatos |

### Acento (UNO solo, máximo dos)
| Token | HEX | Uso |
|-------|-----|-----|
| `--lm-accent` | `#C9603D` | **Cobre/terracota** — el color de LaserMed. CTAs primarios, íconos, líneas de énfasis, hover. |
| `--lm-accent-soft` | `#E8B89E` | Cobre diluido para fondos suaves y badges |

**Por qué cobre:** transmite cuidado humano, calidez, contacto con la piel. No es rojo agresivo (como Neauvia) ni rosa (como Glossier). Es el color del barro, del sol de tarde, del cuidado con las manos. Único en el sector (todos usan rosa, blanco clínico, o rojo).

### Acentos secundarios (uso mínimo)
| Token | HEX | Uso |
|-------|-----|-----|
| `--lm-green` | `#3B5C4E` | Verde olivo profundo, solo en tags "natural" o "piel cuidada" |
| `--lm-sand` | `#D4B996` | Color de piel cálido, texturas secundarias |

> **Regla:** máximo 1 color acento por pantalla. El cobre manda. Si dudas, usa el neutro.

---

## 2. Tipografía

### Display (títulos y hero)
- **Familia:** **Fraunces** (Google Fonts, variable) — serif moderna con personalidad, peso variable, ejes opsz y SOFT que dan calidez
- Pesos: 300 a 900, con itálicas reales
- Uso: H1, H2, frases destacadas, números de sección
- Estilo: mezcla de romana e itálica para énfasis sutiles
- Tamaño:
  - H1 (hero): clamp(48px, 8vw, 120px) — desktop 96–120px
  - H2: clamp(36px, 5vw, 64px)
  - H3: clamp(24px, 3vw, 36px)
- Tracking: ligero negativo en H1, normal en H3
- Line-height: 0.95–1.05 en H1, 1.1–1.2 en H2, 1.3 en H3

### Sans (cuerpo y UI)
- **Familia:** **Inter** (Google Fonts, variable) — humanista, muy legible en todos los tamaños
- Pesos: 400, 500, 600
- Uso: párrafos, captions, botones, nav
- Tamaño:
  - Body: 17–18px / line-height 1.6
  - Caption: 14–15px / line-height 1.5
  - Eyebrow: 12–13px uppercase tracking 0.18em

### Mono (solo para datos técnicos)
- **Familia:** **JetBrains Mono** (Google Fonts)
- Pesos: 400, 500
- Uso: cifras de specs técnicos, números de versión, metadatos legales
- Ejemplo: "808 nm · 1500 mJ · 1–10 Hz"

### Combinación
- **H1 + itálica acento:** para frases de impacto. *"Empieza a sentir tu piel como **tuya** otra vez."* (la palabra "tuya" en itálica o color acento)
- **H1 en serif + H2 en sans + body en sans:** da jerarquía editorial sin ser pesado.

---

## 3. Layout y grid

### Sistema
- **Grid 12 columnas**, gutter 24px, max-width 1280px (1440 en hero).
- **Padding lateral:** 24px mobile, 48px tablet, 80px desktop.
- **Espacio vertical entre bloques:** 120–160px desktop, 80–100px mobile.

### Reglas de oro
- Mucho espacio blanco. Si dudas, más.
- Las imágenes son protagonistas. Títulos van al lado o superpuestos, no compiten.
- Las cards de servicio: borde sutil 1px `--lm-ink-3` 20% opacity, hover border cobre.
- Los botones: **pill** (border-radius 999px) o **ghost** (borde fino 1px + fondo transparente).
- **Numeración romana** en secciones largas (I, II, III, IV) para dar aire editorial.
- Líneas finas horizontales 1px `--lm-ink-3` 20% como divisores de sección.

### Secciones con fondo alterno
1. Hero → fondo `--lm-bg` o video full-bleed
2. Servicios → fondo `--lm-bg-2`
3. Por qué LaserMed → fondo `--lm-bg` con tarjetas blancas
4. Tecnología → fondo `--lm-bg-dark` (oscuro), texto blanco
5. Proceso → fondo `--lm-bg-2`
6. Quiénes somos → fondo `--lm-bg`
7. Espacio → fondo `--lm-bg-dark` con fotos grandes
8. Resultados → fondo `--lm-bg`
9. Precios → fondo `--lm-bg-2`
10. FAQ → fondo `--lm-bg`
11. Agente AI → fondo `--lm-bg-dark` con visual waveform cobre
12. CTA final → fondo `--lm-bg`
13. Footer → fondo `--lm-ink` (oscuro)

---

## 4. Motion (animaciones con scroll)

### Librería
- **GSAP** + **ScrollTrigger** (CDN, no requiere build)
- **Lenis** para smooth scroll (opcional, da el feel Apple)
- **CSS transitions** para hover

### Reglas
- **Respetar `prefers-reduced-motion`**. Si el usuario lo tiene activo, no animar.
- **Todo fade-in-up** con duración 600–800ms, ease "power3.out".
- **Stagger** en cards y listas (0.08s entre cada elemento).
- **Parallax** muy ligero (10–20px máximo) en imágenes del hero y en resultados.
- **Texto que se "revela" letra por letra** en el H1 del hero (split type con GSAP).
- **Botones** con escala sutil en hover (1.02) y sombra suave.
- **Imágenes** con reveal mask (clip-path o scale-from-blur).
- **Navbar** transparente sobre hero, fondo blanco con backdrop-blur al hacer scroll > 50px.
- **Cursor personalizado** opcional, sutil (un círculo de 8px que se agranda en hover sobre CTAs y fotos).

### Línea de tiempo
- Hero: entra en 0–1.2s (texto se escribe, imagen aparece con escala).
- Cada bloque: trigger cuando 30% entra en viewport. Animación 0.6s.
- Footer: aparece al final, sin animación compleja.

---

## 5. Fotografía y visuales

### Dirección de arte
- **Modelos:** mujeres reales, 28–50, etnias diversas, sin retoque excesivo, piel visible (poros, pecas, textura real).
- **Hombres:** cuando aparezcan, similar — real, atlético o cuidado, sin bodybuilder.
- **Cabello:** suelto, textura natural, no planchado.
- **Luz:** natural (ventana) o softbox cálida. NUNCA flash directo. NUNCA HDR.
- **Composición:** minimalista, mucho aire, mirada a cámara o de perfil.
- **Color:** paleta cálida, ligeramente desaturada, grano sutil (estilo "film grain").

### Tomas clave
- Hero: retrato medio, piel iluminada por luz lateral, mirada tranquila, manos sobre la piel.
- Servicios: detalle de la piel, sin cara (cuello, hombro, mano) en luz natural.
- Espacio: interior amplio, líneas limpias, mucho cristal, un toque verde (planta).
- Quiénes somos: retrato 3/4 con luz natural.
- Resultados: close-up de la zona tratada, antes/después con la misma luz y encuadre.

### Lo que NO
- Fotos de stock sonrientes en bata blanca.
- Antes/después dramáticos tipo "milagro".
- Modelos perfectos de Instagram.
- Filtros Instagram / presets agresivos.

### Imágenes IA (usar con criterio)
- Para landings y mockups: generación con `image_synthesize` (MiniMax) en prompts muy específicos.
- Estilo: editorial, fotorrealista, paleta cálida, fondo neutro, modelo diversa.
- Indicar visualmente que son renders en la versión final o reemplazar por fotos reales.

### Video hero
- Loop de 6–8s, sin audio, de la piel tocada por luz, manos suaves, la máquina en su soporte.
- Slow motion 0.7x, grano ligero, color grading cálido.
- Generar con `batch_image_to_video` (MiniMax) a partir de imagen still.
- En implementación: autoplay muted loop playsinline, fallback a poster image.

---

## 6. Iconografía

- **Línea fina** (1.5px), 24×24 base, escala a 32 en cards.
- Color: `--lm-ink` o `--lm-accent` (cuando es el ícono principal del card).
- Sets: íconos propios SVG inline (no dependencias externas para no inflar).
- Estilo: bordes redondeados sutiles, sin relleno.

### Íconos clave a dibujar (SVG)
- Laser ray (haz de luz)
- Calendar (citas)
- Document with check (valoración)
- Hand with cream (cuidado)
- Sparkle (resultado)
- Mic (agente AI)
- WhatsApp logo (en botón)
- Instagram / TikTok (en footer)

---

## 7. Componentes UI clave

### Botón primario (CTA)
- Fondo `--lm-accent`, texto blanco, padding 16px 32px, border-radius 999px.
- Hover: fondo `--lm-ink`, scale 1.02, transition 300ms.
- Tipografía: Inter 15px medium, tracking 0.02em uppercase.

### Botón ghost
- Borde 1px `--lm-ink`, fondo transparente, texto `--lm-ink`.
- Hover: fondo `--lm-ink`, texto blanco.

### Card de servicio
- Fondo blanco o `--lm-bg-2` (alternar), padding 32px, border 1px `--lm-ink-3` 15%.
- Hover: border-color `--lm-accent`, transform translateY(-4px), shadow sutil.
- Ícono 32px cobre, título serif H3, 2 líneas de cuerpo, link "Ver más →" cobre.

### Card de testimonio
- Fondo `--lm-bg-2`, padding 40px, sin foto (a veces la foto pesa más que la frase).
- Cita en serif itálica, "—" nombre, servicio.

### Form de contacto
- Inputs: border-bottom 1px `--lm-ink-3` 30%, sin background, sin padding lateral exagerado.
- Focus: border-color `--lm-accent`.
- Label arriba del input, en caption Inter 13px uppercase.

### Sticky WhatsApp
- Botón circular 56px, fondo `#25D366` o `--lm-accent`, esquina inferior derecha.
- Animación pulse cada 4s para llamar la atención.
- Tooltip en hover: "Hablar con LaserMed".

---

## 8. Tipografía de voz (para copy)

- **Tuteo** siempre.
- **Frases cortas** para impacto. Largas para explicar procesos.
- **"Empezar a"** en lugar de promesas absolutas.
- **Preguntas** intercaladas (la mente responde aunque no quiera).
- **"Tú"** en lugar de "usted". **"Te"** en imperativo cercano.

---

## 9. Performance budget

- **HTML:** < 50 KB.
- **CSS:** < 30 KB (crítico) + 30 KB lazy.
- **JS:** < 100 KB (GSAP + ScrollTrigger + Lenis vía CDN).
- **Imágenes:** WebP/AVIF, < 200 KB cada una, hero < 500 KB, video < 2 MB.
- **LCP < 2.5s, CLS < 0.1, FID < 100ms.**

---

## 10. Estructura de archivos del proyecto

```
04-implementacion/landing/
├── index.html
├── css/
│   ├── reset.css
│   ├── tokens.css          (variables CSS)
│   ├── base.css            (tipografía, fondo)
│   ├── components.css      (botones, cards, nav)
│   ├── sections.css        (cada bloque)
│   └── motion.css          (animaciones CSS)
├── js/
│   ├── main.js             (init GSAP, nav, smooth scroll)
│   ├── scroll-animations.js (revela por bloque)
│   ├── agent.js            (widget ElevenLabs)
│   └── forms.js
└── assets/
    ├── img/
    │   ├── hero-poster.webp
    │   ├── hero-video.mp4 (opcional)
    │   ├── servicios/*.webp
    │   ├── equipo/*.webp
    │   ├── espacio/*.webp
    │   └── resultados/*.webp
    └── icons/
        └── *.svg
```

> El sitio es **estático puro**: HTML + CSS + JS sin build, sin framework. Se sube a cualquier hosting (Vercel, Netlify, GitHub Pages, S3). El cliente lo puede mantener con un editor de texto.
