# Accesibilidad y Perfil de Usuario - HornoVivo

Este documento detalla el enfoque de accesibilidad de la plataforma HornoVivo, definiendo el perfil de nuestros usuarios y estableciendo nuestro compromiso con las normativas internacionales de accesibilidad web (WCAG).

## 1. Perfil del Usuario

La audiencia de HornoVivo es diversa y abarca un amplio espectro de habilidades técnicas, cognitivas y físicas. Entender a nuestros usuarios es fundamental para proporcionar una experiencia inclusiva.

### Características Principales de la Audiencia
*   **Diversidad de Edad:** Desde usuarios jóvenes muy familiarizados con la tecnología hasta adultos mayores que pueden tener menor destreza digital o problemas de visión relacionados con la edad.
*   **Contexto de Uso:** Los usuarios pueden acceder a la plataforma desde dispositivos móviles en movimiento (bajo condiciones de luz variables) o desde computadoras de escritorio.
*   **Capacidades Variables:**
    *   *Visuales:* Usuarios con visión baja, daltonismo o que dependen de lectores de pantalla.
    *   *Motoras:* Usuarios que navegan exclusivamente mediante teclado o que tienen dificultades con movimientos precisos del ratón.
    *   *Cognitivas:* Usuarios que requieren lenguaje claro, instrucciones directas y navegación predecible para evitar la sobrecarga de información.

## 2. Normativas WCAG (Web Content Accessibility Guidelines)

Las Pautas de Accesibilidad al Contenido en la Web (WCAG) son el estándar internacional para hacer que el contenido web sea más accesible. Se dividen en cuatro principios fundamentales: **Perceptible, Operable, Comprensible y Robusto (POUR)**.

Las WCAG establecen tres niveles de conformidad:
*   **Nivel A (Mínimo):** Requisitos básicos de accesibilidad. Sin ellos, algunos usuarios simplemente no pueden usar el sitio.
*   **Nivel AA (Recomendado):** El estándar de la industria y la meta para la mayoría de los sitios web comerciales y gubernamentales. Elimina las principales barreras de acceso para la mayoría de las personas con discapacidad.
*   **Nivel AAA (Óptimo):** El nivel más alto y estricto. No siempre es posible aplicarlo a todo el contenido, pero se recomienda para partes críticas.

## 3. Nuestro Nivel de Compromiso en Accesibilidad

En HornoVivo, nuestro objetivo principal es cumplir firmemente con el **Nivel AA de las WCAG 2.1**, asegurando al mismo tiempo que cumplimos todos los criterios del Nivel A. Implementamos prácticas seleccionadas del Nivel AAA donde resultan de mayor beneficio para nuestros usuarios.

### Medidas Implementadas (Nivel de Usuario en Accesibilidad)

Para garantizar que nuestro sitio responda a las necesidades del perfil de usuario definido, nos enfocamos en las siguientes áreas clave:

#### A. Experiencia Visual (Perceptible)
*   **Contraste de Color:** Mantenemos una relación de contraste mínima de 4.5:1 para texto normal y 3:1 para texto grande (Cumple con AA). No dependemos exclusivamente del color para transmitir información.
*   **Texto Alternativo (Alt Text):** Todas las imágenes relevantes cuentan con descripciones precisas para usuarios de lectores de pantalla.
*   **Escalabilidad:** El texto puede redimensionarse hasta un 200% sin pérdida de contenido o funcionalidad, beneficiando a usuarios con visión reducida.

#### B. Navegación e Interacción (Operable)
*   **Navegación por Teclado:** Todo el sitio es completamente funcional utilizando únicamente el teclado, sin "trampas" de foco.
*   **Indicadores de Foco:** Proveemos indicadores visuales claros y evidentes para los elementos que reciben el foco, ayudando a usuarios con discapacidades motoras y visuales.
*   **Tiempo Suficiente:** Evitamos los límites de tiempo estrictos para interactuar con el contenido o completar formularios, reduciendo el estrés cognitivo.

#### C. Claridad y Estructura (Comprensible)
*   **Jerarquía de Encabezados:** Utilizamos una estructura lógica de etiquetas HTML (`<h1>` a `<h6>`) para facilitar la navegación mediante lectores de pantalla.
*   **Lenguaje Claro:** Empleamos un lenguaje sencillo e instrucciones directas, beneficiando a todos los usuarios, especialmente a aquellos con discapacidades cognitivas o de aprendizaje.
*   **Identificación de Errores:** Los formularios proporcionan retroalimentación clara y sugerencias de corrección cuando se cometen errores de entrada.

#### D. Compatibilidad Técnica (Robusto)
*   **Semántica HTML:** Utilizamos HTML semántico válido para garantizar la máxima compatibilidad con tecnologías de asistencia actuales y futuras (como NVDA, JAWS y VoiceOver).
*   **Atributos ARIA:** Empleamos roles y propiedades ARIA (Accessible Rich Internet Applications) de forma prudente para enriquecer el contexto de los elementos interactivos complejos.

## Conclusión

La accesibilidad en HornoVivo no es una característica opcional, sino un pilar fundamental de nuestro diseño y desarrollo. Reconocemos que el cumplimiento de las normativas WCAG es un proceso continuo. Constantemente evaluamos y mejoramos nuestra plataforma para asegurar que *todos* nuestros usuarios, sin importar sus capacidades, tengan una experiencia fluida, digna y satisfactoria.
