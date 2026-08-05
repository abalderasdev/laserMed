# LaserMed · Boutique de láser estético

> Piel cuidada con luz de verdad. CDMX.
> Depilación definitiva, eliminación de tatuajes, manchas, rejuvenecimiento.
> Con valoración médica, manos certificadas y tecnología que te explicamos en español.

**Landing:** https://lasermed.abdev.click
**Documentación completa:** https://lasermed.abdev.click/docs/
**Estudio de mercado:** https://lasermed.abdev.click/docs/estudio-de-mercado.html

---

## 🎯 Para el cliente

| Si quieres... | Ve a... |
|---|---|
| Ver la landing | https://lasermed.abdev.click |
| Dejar feedback sobre la página (clickeas elementos y dejas cambios) | https://lasermed.abdev.click?feedback=1 |
| Ver todos los feedbacks recibidos | https://lasermed.abdev.click?admin=1 |
| Leer la documentación del proyecto | https://lasermed.abdev.click/docs/ |
| Ver el estudio de mercado | https://lasermed.abdev.click/docs/estudio-de-mercado.html |
| Ver el mensaje maestro de marca | https://lasermed.abdev.click/docs/mensaje-maestro.html |
| Leer las instrucciones de permisos COFEPRIS | https://lasermed.abdev.click/docs/permisos.html |
| Ver el system prompt del agente AI | https://lasermed.abdev.click/docs/agente-ai.html |
| Descargar los .md originales | https://lasermed.abdev.click/docs/raw/ |

---

## 🚀 Stack

- **HTML5 + CSS3 + Vanilla JS** — sin build, sin framework.
- **Lenis-free**: scroll nativo del browser (más rápido, más responsivo).
- **CSS scroll-behavior: smooth** para anchor links.
- **Reveal animations con IntersectionObserver** (solo opacity, sin transform).
- **ElevenLabs ConvAI** — agente de voz AI (config en `/docs/agente-ai.html`).
- **Vercel** — hosting estático con CDN global.

## 📂 Estructura

```
laserMed/
├── index.html              # Landing principal
├── 404.html                # Página 404 custom
├── favicon.svg
├── og-image.webp           # Para Open Graph (compartir en WhatsApp/redes)
├── sitemap.xml
├── robots.txt
├── vercel.json             # Config de cache headers y rewrites
├── css/                    # 6 archivos modulares
│   ├── reset.css · tokens.css · base.css
│   ├── components.css · sections.css · motion.css
├── js/                     # 3 archivos
│   ├── main.js             # nav, smooth scroll, reveal, FAQ, form, video
│   ├── agent.js            # ElevenLabs ConvAI integration
│   └── feedback.js         # Feedback layer (impeccable-lite)
├── assets/
│   ├── img/                # 29 imágenes WebP optimizadas
│   └── video/              # 2 videos MP4
├── docs/                   # Documentación pública
│   ├── index.html
│   ├── *.html (11 docs)    # Estudio, mensaje maestro, copy, permisos, etc.
│   └── raw/                # .md originales
├── docs-assets/docs.css
└── (build_*.py, optimize.py, gen_og.py son scripts regenerables, ignorados por git)
```

## 🛠️ Desarrollo local

```bash
python -m http.server 8000
# Abrir http://localhost:8000
```

## 🌐 Despliegue

Push a `main` → Vercel redeploy automático.

```bash
git add .
git commit -m "mensaje"
git push
```

### Variables de entorno (Vercel)
- `ELEVENLABS_AGENT_ID` — el ID del agente conversacional (a configurar)

## 🎨 Sistema de marca

- **Colores:** marfil cálido `#F5F1EA` + cobre `#C9603D` + negro `#161412`
- **Tipografía:** Fraunces (serif) + Inter (sans) + JetBrains Mono
- **Tono:** cálido, directo, honesto, tuteo
- **Referencia visual:** Apple + Neauvia + Aesop

## 💬 Feedback del cliente

El sistema de feedback permite al cliente dejar cambios clickeando elementos:

| Acción | URL |
|---|---|
| Activar modo feedback | `?feedback=1` |
| Ver panel admin (todos los feedbacks) | `?admin=1` |
| Botón flotante | esquina inferior izquierda |

Los feedbacks se guardan en `localStorage` del navegador del cliente.
El admin los exporta como JSON para implementar los cambios.

## 📋 Pendientes para producción

- [ ] Nombre definitivo + logo
- [ ] Folio Aviso de Funcionamiento COFEPRIS
- [ ] Registro sanitario del equipo
- [ ] Responsable sanitario (cédula, foto, especialidad)
- [ ] Operadora principal (foto, certificación)
- [ ] Precios definitivos
- [ ] Dirección, WhatsApp, email, horarios reales
- [ ] Casos antes/después con consentimiento firmado
- [ ] Fotos reales del espacio y equipo
- [ ] Póliza de RC profesional
- [ ] `ELEVENLABS_AGENT_ID` real (en Vercel env)
- [ ] Eliminar todos los `[Por definir]` del HTML

Ver `docs/permisos.html` para los pasos regulatorios.

## 📄 Licencia

Proyecto interno · ABDev · 2026
