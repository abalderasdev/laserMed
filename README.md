# LaserMed · Boutique de láser estético

> Piel cuidada con luz de verdad. CDMX.
> Depilación definitiva, eliminación de tatuajes, manchas, rejuvenecimiento.
> Con valoración médica, manos certificadas y tecnología que te explicamos en español.

**Landing:** [lasermed.mx](https://lasermed.mx) (en despliegue)
**Documentación completa:** [lasermed.mx/docs](https://lasermed.mx/docs)

---

## 🚀 Stack

- **HTML5 + CSS3 + Vanilla JS** — sin build step, sin framework.
- **GSAP + ScrollTrigger** — animaciones de scroll.
- **Lenis** — smooth scroll.
- **ElevenLabs ConvAI** — agente de voz AI (config en `/docs/agente-ai.html`).
- **Vercel** — hosting estático con CDN global.

## 📂 Estructura

```
.
├── index.html              # Landing principal
├── css/                    # Estilos modulares (reset, tokens, base, components, sections, motion)
├── js/                     # main.js (animaciones, form, FAQ) + agent.js (ElevenLabs)
├── assets/
│   ├── img/                # 19 imágenes WebP optimizadas (~3.5 MB total)
│   └── video/              # 2 videos MP4 (hero + tecnología)
├── docs/                   # Documentación pública (estudio de mercado, copy, permisos, etc.)
│   ├── index.html          # Índice navegable
│   ├── *.html              # Documentos renderizados
│   └── raw/                # Archivos .md originales
├── docs-assets/            # CSS específico de /docs
├── vercel.json             # Config de headers, cache, rewrites
├── build_docs.py           # Generador de /docs/ (regenerable)
└── optimize.py             # Optimizador de imágenes (regenerable)
```

## 🛠️ Desarrollo local

```bash
# Servir local
python -m http.server 8000

# Regenerar /docs/ desde los .md
python build_docs.py

# Regenerar imágenes optimizadas
python optimize.py
```

## 🌐 Despliegue

Este proyecto se despliega automáticamente en **Vercel** al hacer push a la rama `main`.

URLs:
- `https://lasermed.mx/` — landing
- `https://lasermed.mx/docs/` — documentación completa
- `https://lasermed.mx/docs/raw/` — archivos .md originales

### Variables de entorno (cuando se integre ElevenLabs)
Configurar en Vercel Dashboard:
- `ELEVENLABS_AGENT_ID` — ID del agente conversacional

## 📋 Pendientes para producción

Ver `docs/permisos.html` (o `docs/raw/permisos.md`):

- [ ] Nombre definitivo + logo
- [ ] Folio Aviso de Funcionamiento COFEPRIS
- [ ] Registro sanitario del equipo
- [ ] Responsable sanitario (cédula)
- [ ] Precios definitivos
- [ ] Dirección y contacto
- [ ] Casos antes/después con consentimiento
- [ ] Fotos reales del espacio
- [ ] Póliza de RC profesional
- [ ] `ELEVENLABS_AGENT_ID`

## 📄 Licencia

Proyecto interno · ABDev · 2026
