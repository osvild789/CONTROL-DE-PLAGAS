/* ============================================================
   script.js  —  Simulador de Plagas con Fibonacci & Primos
   Desafío Web 2025
   ============================================================ */

// ─────────────────────────────────────────────
// FUNCIÓN: Verificar si un número es primo
// Usa solo document.getElementById() para HTML
// ─────────────────────────────────────────────
function esPrimo(numero) {
  // 0 y 1 NO son primos
  if (numero < 2) return false;

  // Contamos divisores
  let contador = 0;
  for (let i = 1; i <= numero; i++) {
    if (numero % i === 0) {
      contador++;
    }
  }
  // Un primo tiene exactamente 2 divisores: 1 y él mismo
  return contador === 2;
}

// ─────────────────────────────────────────────
// FUNCIÓN: Generar serie Fibonacci hasta n términos
// Sin usar arrays (solo variables simples)
// Retorna un array con los valores para poder
// mostrarlos en pantalla.
// ─────────────────────────────────────────────
function generarFibonacci(n) {
  let resultados = [];

  // Casos base
  let a = 0; // F(0) — usamos como base interna
  let b = 1; // F(1)
  let c;

  if (n >= 1) resultados.push(1); // mes 1 → 1 insecto
  if (n >= 2) resultados.push(1); // mes 2 → 1 insecto

  // A partir del mes 3 aplicamos la fórmula F(n) = F(n-1) + F(n-2)
  for (let i = 3; i <= n; i++) {
    c = a + b;
    a = b;
    b = c;
    resultados.push(c);
  }

  return resultados;
}

// ─────────────────────────────────────────────
// FUNCIÓN PRINCIPAL: Simular y mostrar resultados
// ─────────────────────────────────────────────
function simular() {

  // Obtener datos del formulario usando getElementById (requisito obligatorio)
  let mesesInput   = document.getElementById("meses");
  let insectoInput = document.getElementById("insecto");
  let umbralInput  = document.getElementById("umbral");

  let meses   = parseInt(mesesInput.value);
  let insecto = insectoInput.value;
  let umbral  = parseInt(umbralInput.value);

  // ── Validaciones ──────────────────────────────
  if (!meses || meses < 1 || meses > 30) {
    mostrarError("⚠️ Por favor ingresa un número de meses entre 1 y 30.");
    return;
  }

  if (!umbral || umbral < 1) {
    mostrarError("⚠️ El umbral de alerta debe ser mayor a 0.");
    return;
  }

  // ── Calcular la serie ─────────────────────────
  let serie = generarFibonacci(meses);

  let totalInsectos    = serie[serie.length - 1];        // último mes
  let maxPoblacion     = Math.max(...serie);
  let mesesEnAlerta    = serie.filter(v => v >= umbral).length;
  let etapasCriticas   = serie.filter(v => esPrimo(v)).length;

  // ── Construir HTML de resultados ──────────────
  let html = "";

  // Estadísticas rápidas
  let claseMax = totalInsectos >= umbral * 3 ? "danger" : totalInsectos >= umbral ? "warn" : "";

  html += `<div class="stats-bar">
    <div class="stat-box">
      <span class="stat-box__val">${meses}</span>
      <span class="stat-box__label">Meses simulados</span>
    </div>
    <div class="stat-box">
      <span class="stat-box__val ${claseMax}">${totalInsectos.toLocaleString()}</span>
      <span class="stat-box__label">Insectos mes ${meses}</span>
    </div>
    <div class="stat-box">
      <span class="stat-box__val ${mesesEnAlerta > 0 ? 'warn' : ''}">${mesesEnAlerta}</span>
      <span class="stat-box__label">Meses en alerta</span>
    </div>
    <div class="stat-box">
      <span class="stat-box__val">${etapasCriticas}</span>
      <span class="stat-box__label">Etapas críticas (primos)</span>
    </div>
  </div>`;

  // Tabla detallada
  html += `<div class="tabla-scroll">
  <table class="tabla-res">
    <thead>
      <tr>
        <th>Mes</th>
        <th>Población (${insecto})</th>
        <th>Barra</th>
        <th>Estado</th>
      </tr>
    </thead>
    <tbody>`;

  for (let i = 0; i < serie.length; i++) {
    let mes         = i + 1;
    let poblacion   = serie[i];
    let primo       = esPrimo(poblacion);
    let enAlerta    = poblacion >= umbral;
    let porcentaje  = Math.min(100, Math.round((poblacion / maxPoblacion) * 100));

    // Clases de fila
    let claseFila  = "";
    let claseBarra = "";
    let badge      = "✅ Normal";

    if (primo && enAlerta) {
      claseFila  = "fila-peligro";
      claseBarra = "danger";
      badge      = "🔴 Primo + Alerta";
    } else if (primo) {
      claseFila  = "fila-primo";
      claseBarra = "danger";
      badge      = "🔴 Etapa crítica (primo)";
    } else if (enAlerta) {
      claseFila  = "fila-alerta";
      claseBarra = "warn";
      badge      = "⚠️ Supera umbral";
    } else {
      claseBarra = "";
    }

    // delay de animación por fila
    let delay = i * 40;

    html += `
      <tr class="${claseFila}" style="animation-delay: ${delay}ms">
        <td class="mes-num">Mes ${mes}</td>
        <td class="poblacion">${poblacion.toLocaleString()}</td>
        <td class="bar-cell">
          <div class="barra-cont">
            <div class="barra-fill ${claseBarra}" style="width: ${porcentaje}%"></div>
          </div>
        </td>
        <td class="badge-cell">${badge}</td>
      </tr>`;
  }

  html += `</tbody></table></div>`;

  // Leyenda
  html += `<div class="leyenda">
    <div class="leyenda-item"><span class="leyenda-dot verde"></span> Crecimiento normal</div>
    <div class="leyenda-item"><span class="leyenda-dot rojo"></span> Etapa crítica (número primo — momento ideal para intervención)</div>
    <div class="leyenda-item"><span class="leyenda-dot amarillo"></span> Supera umbral de alerta</div>
  </div>`;

  // Mensaje final de alerta
  if (totalInsectos >= umbral) {
    html += `<div class="alerta-final">
      <strong>⚠️ ALERTA:</strong> Al finalizar los ${meses} meses la población de <em>${insecto}</em> 
      alcanza <strong>${totalInsectos.toLocaleString()} individuos</strong>, superando el umbral de 
      intervención de ${umbral.toLocaleString()}. Se recomienda aplicar control integrado de plagas.
      ${etapasCriticas > 0 ? `<br><strong>💡 Tip:</strong> Hay <strong>${etapasCriticas} etapas críticas</strong> (marcadas en rojo) donde la plaga es más vulnerable y la intervención es más efectiva.` : ""}
    </div>`;
  } else {
    html += `<div class="alerta-final ok">
      <strong>✅ Bajo control:</strong> La población de <em>${insecto}</em> se mantiene por debajo del 
      umbral de alerta de ${umbral.toLocaleString()} durante todos los ${meses} meses. 
      No se requiere intervención urgente por ahora.
    </div>`;
  }

  // Mostrar en pantalla usando getElementById (requisito obligatorio)
  document.getElementById("resultado").innerHTML = html;

  // Scroll suave hacia los resultados
  document.getElementById("resultados").scrollIntoView({ behavior: "smooth", block: "start" });
}

// ─────────────────────────────────────────────
// FUNCIÓN: Mostrar mensaje de error en pantalla
// ─────────────────────────────────────────────
function mostrarError(msg) {
  document.getElementById("resultado").innerHTML =
    `<div class="alerta-final" style="border-left-color: var(--red); background: rgba(255,79,79,0.1); padding: 1.5rem;">
      ${msg}
    </div>`;
}

// ─────────────────────────────────────────────
// EVENT LISTENER del botón
// Usando getElementById (requisito obligatorio)
// ─────────────────────────────────────────────
document.getElementById("btnSimular").addEventListener("click", simular);

// También permitir Enter en los campos numéricos
document.getElementById("meses").addEventListener("keydown", function(e) {
  if (e.key === "Enter") simular();
});

document.getElementById("umbral").addEventListener("keydown", function(e) {
  if (e.key === "Enter") simular();
});