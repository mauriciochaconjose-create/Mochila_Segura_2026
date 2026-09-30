const $ = id => document.getElementById(id);


/* =========================
   ESTADO Y LOCALSTORAGE
========================= */

const ESTADO_VERSION = "mochilaSeguraEstadoV3";

if(localStorage.getItem("estadoVersionMochila") !== ESTADO_VERSION){

  localStorage.removeItem("puntosMochila");
  localStorage.removeItem("nivelesCompletadosMochila");
  localStorage.removeItem("nivelDesbloqueadoMochila");
  localStorage.removeItem("mejorPuntuacionMochila");
  localStorage.removeItem("logrosMochila");
  localStorage.removeItem("checklistMochila");
  localStorage.removeItem("checkEstadoMochila");
  localStorage.removeItem("planFamiliar");
  localStorage.removeItem("recompensaMochilaEntregada");

  localStorage.setItem(
    "estadoVersionMochila",
    ESTADO_VERSION
  );
}


let puntos =
  Number(localStorage.getItem("puntosMochila")) || 0;

let nivelesCompletados =
  Number(localStorage.getItem("nivelesCompletadosMochila")) || 0;

let nivelDesbloqueado =
  Number(localStorage.getItem("nivelDesbloqueadoMochila")) || 1;

nivelDesbloqueado =
  Math.min(10,Math.max(1,nivelDesbloqueado));


let mejorPuntuacion =
  Number(localStorage.getItem("mejorPuntuacionMochila")) || 0;


let medallas =
  JSON.parse(
    localStorage.getItem("logrosMochila") || "{}"
  );


let checklistItems =
  JSON.parse(
    localStorage.getItem("checklistMochila") || "[]"
  );


const backpackBase = [
  "Agua",
  "Alimentos no perecibles",
  "Linterna",
  "Pilas",
  "Botiquín",
  "Radio",
  "Teléfono y cargador",
  "Documentos",
  "Artículos de higiene",
  "Ropa de abrigo",
  "Mascarillas",
  "Papel higiénico",
  "Recipientes para agua"
];


function saveStats(){

  localStorage.setItem(
    "puntosMochila",
    puntos
  );

  localStorage.setItem(
    "nivelesCompletadosMochila",
    nivelesCompletados
  );

  localStorage.setItem(
    "nivelDesbloqueadoMochila",
    nivelDesbloqueado
  );

  localStorage.setItem(
    "mejorPuntuacionMochila",
    mejorPuntuacion
  );

  localStorage.setItem(
    "logrosMochila",
    JSON.stringify(medallas)
  );

  updateDashboard();
}


/* =========================
   REINICIAR PROGRESO
========================= */

function reiniciarProgresoCompleto(){

  if(
    !confirm(
      "¿Seguro que quieres reiniciar todo tu progreso?"
    )
  ){
    return;
  }


  detenerTemporizador();


  puntos = 0;
  nivelesCompletados = 0;
  nivelDesbloqueado = 1;
  mejorPuntuacion = 0;
  medallas = {};
  checklistItems = [];


  localStorage.removeItem("puntosMochila");
  localStorage.removeItem("nivelesCompletadosMochila");
  localStorage.removeItem("nivelDesbloqueadoMochila");
  localStorage.removeItem("mejorPuntuacionMochila");
  localStorage.removeItem("logrosMochila");
  localStorage.removeItem("checklistMochila");
  localStorage.removeItem("checkEstadoMochila");
  localStorage.removeItem("planFamiliar");
  localStorage.removeItem("recompensaMochilaEntregada");


  localStorage.setItem(
    "estadoVersionMochila",
    ESTADO_VERSION
  );


  juego = {
    nivel:1,
    pregunta:0,
    vidas:3,
    tiempo:0,
    interval:null,
    activo:false,
    puntosNivel:0
  };


  $("resultadoMochila").innerHTML = "";
  $("planResultado").innerHTML = "";


  document.querySelectorAll(
    "#mochila input"
  ).forEach(input=>{
    if(input.type==="number"){
      input.value =
        input.id==="personas"
          ? 4
          : input.id==="dias"
          ? 1
          : 0;
    }
  });


  $("mascotas").value = 1;
  $("ninos").value = 1;


  renderChecklist();
  seleccionarNivel(1);
  updateDashboard();


  alert(
    "✅ El progreso de MochilaSegura fue reiniciado."
  );
}


/* =========================
   DASHBOARD
========================= */

function updateDashboard(){

  $("statPuntos").textContent =
    puntos.toLocaleString();

  $("statNiveles").textContent =
    nivelesCompletados + "/10";

  $("statMedallas").textContent =
    Object.values(medallas)
      .filter(Boolean)
      .length;


  const checks =
    document.querySelectorAll(
      ".check-item input"
    );


  const done =
    [...checks].filter(
      x=>x.checked
    ).length;


  const percent =
    checks.length
      ? Math.round(
          done / checks.length * 100
        )
      : 0;


  $("statPreparacion").textContent =
    percent + "%";


  updateEvaluation();
  renderLevelGrid();
  renderAchievements();
}


/* =========================
   GENERADOR DE MOCHILA
========================= */

function generarMochila(){

  const personas =
    Math.max(
      1,
      Number($("personas").value) || 1
    );


  const dias =
    Math.max(
      1,
      Number($("dias").value) || 1
    );


  const ninos =
    Math.max(
      0,
      Number($("ninos").value) || 0
    );


  const adultos =
    Math.max(
      0,
      Number($("adultos").value) || 0
    );


  const discapacidad =
    Math.max(
      0,
      Number($("discapacidad").value) || 0
    );


  const mascotas =
    Math.max(
      0,
      Number($("mascotas").value) || 0
    );


  const riesgo =
    $("riesgo").value;


  const agua =
    personas * dias * 2;


  const alimentos =
    personas * dias * 3;


  const papel =
    personas * dias;


  const mascarillas =
    personas * 2;


  const recipientes =
    personas;


  const ropa =
    personas;


  const aguaMascota =
    mascotas * dias;


  const alimentoMascota =
    mascotas * dias * 2;


  let items = [

    [
      "💧",
      "Agua",
      agua + " unidades"
    ],

    [
      "🍪",
      "Alimentos no perecibles",
      alimentos + " unidades"
    ],

    [
      "🔦",
      "Linterna",
      "1 unidad"
    ],

    [
      "🔋",
      "Pilas o batería de respaldo",
      "1 paquete"
    ],

    [
      "🩹",
      "Botiquín",
      "1"
    ],

    [
      "📻",
      "Radio",
      "1"
    ],

    [
      "📱",
      "Teléfono y cargador",
      personas + " equipo(s)"
    ],

    [
      "📄",
      "Documentos importantes",
      "1 paquete"
    ],

    [
      "🧼",
      "Artículos de higiene",
      personas + " kit(s)"
    ],

    [
      "👕",
      "Ropa de abrigo",
      ropa + " conjunto(s)"
    ],

    [
      "😷",
      "Mascarillas",
      mascarillas + " unidades"
    ],

    [
      "🧻",
      "Papel higiénico",
      papel + " unidad(es)"
    ],

    [
      "🪣",
      "Recipientes para agua",
      recipientes + " unidad(es)"
    ]

  ];


  if(ninos > 0){

    items.push([
      "🧸",
      "Artículos para niños",
      ninos + " kit(s)"
    ]);

  }


  if(adultos > 0){

    items.push([
      "🧓",
      "Artículos para adultos mayores",
      adultos + " kit(s)"
    ]);

  }


  if(discapacidad > 0){

    items.push([
      "♿",
      "Artículos según necesidad de discapacidad",
      discapacidad + " kit(s)"
    ]);

  }


  if(mascotas > 0){

    items.push([
      "🐶",
      "Agua para mascotas",
      aguaMascota + " unidad(es)"
    ]);


    items.push([
      "🐾",
      "Alimento para mascotas",
      alimentoMascota + " porciones"
    ]);

  }


  const recomendaciones = {

    general:
      "Mantén la mochila accesible y revisa periódicamente sus productos.",

    terremoto:
      "Incluye linterna, radio, documentos y elementos que permitan mantenerse preparado después de un movimiento fuerte.",

    incendio:
      "Mantén la mochila lejos de fuentes de calor y conoce las rutas de evacuación.",

    inundacion:
      "Protege documentos y objetos importantes de la humedad y evita zonas inundadas.",

    huaico:
      "Mantén la mochila lista para una posible evacuación y evita quebradas y zonas de peligro.",

    lluvias:
      "Protege los artículos de la humedad y permanece atento a las alertas oficiales."

  };


  const htmlItems =
    items.map(item=>`

      <div>

        <strong>
          ${item[0]} ${item[1]}
        </strong>

        <span>
          ${item[2]}
        </span>

      </div>

    `).join("");


  $("resultadoMochila").innerHTML = `

    <div class="result-box">

      <h3>
        🎒 Mochila generada correctamente
      </h3>

      <p>
        <b>Personas:</b> ${personas}
      </p>

      <p>
        <b>Días:</b> ${dias}
      </p>

      <p>
        <b>Riesgo:</b> ${$("riesgo").selectedOptions[0].text}
      </p>


      <div class="item-list">

        ${htmlItems}

      </div>


      <div class="risk-note">

        <b>💡 Recomendación:</b>

        ${recomendaciones[riesgo]}

      </div>

    </div>

  `;


  checklistItems =
    items.map(item=>item[1]);


  localStorage.setItem(
    "checklistMochila",
    JSON.stringify(checklistItems)
  );


  renderChecklist();


  if(
    !localStorage.getItem(
      "recompensaMochilaEntregada"
    )
  ){

    puntos += 50;

    localStorage.setItem(
      "recompensaMochilaEntregada",
      "true"
    );

    saveStats();

  }


  calcularPresupuesto({

    personas,
    dias,
    ninos,
    adultos,
    discapacidad,
    mascotas

  });

}


/* =========================
   PRESUPUESTO
========================= */

const preciosMochila = {

  agua:3.00,

  alimento:4.00,

  linterna:10.00,

  pilas:6.00,

  botiquin:14.00,

  radio:20.00,

  higiene:8.00,

  abrigo:15.00,

  mascarilla:1.90,

  papel:3.00,

  recipiente:5.00,

  aguaMascota:3.00,

  alimentoMascota:4.00,

  mochila:30.00

};


function calcularPresupuesto(datos){

  const personas =
    Math.max(
      1,
      Number(datos.personas) || 1
    );


  const dias =
    Math.max(
      1,
      Number(datos.dias) || 1
    );


  const mascotas =
    Math.max(
      0,
      Number(datos.mascotas) || 0
    );


  const items = [

    {
      nombre:"💧 Agua",
      cantidad:personas * dias * 2,
      precio:preciosMochila.agua
    },


    {
      nombre:"🍪 Alimentos no perecibles",
      cantidad:personas * dias * 3,
      precio:preciosMochila.alimento
    },


    {
      nombre:"🔦 Linterna",
      cantidad:1,
      precio:preciosMochila.linterna
    },


    {
      nombre:"🔋 Pilas o batería de respaldo",
      cantidad:1,
      precio:preciosMochila.pilas
    },


    {
      nombre:"🩹 Botiquín",
      cantidad:1,
      precio:preciosMochila.botiquin
    },


    {
      nombre:"📻 Radio",
      cantidad:1,
      precio:preciosMochila.radio
    },


    {
      nombre:"🧴 Artículos de higiene",
      cantidad:personas,
      precio:preciosMochila.higiene
    },


    {
      nombre:"👕 Ropa de abrigo",
      cantidad:personas,
      precio:preciosMochila.abrigo
    },


    {
      nombre:"😷 Mascarillas",
      cantidad:personas * 2,
      precio:preciosMochila.mascarilla
    },


    {
      nombre:"🧻 Papel higiénico",
      cantidad:personas * dias,
      precio:preciosMochila.papel
    },


    {
      nombre:"🪣 Recipientes para agua",
      cantidad:personas,
      precio:preciosMochila.recipiente
    }

  ];


  if(mascotas > 0){

    items.push({

      nombre:"🐶 Agua para mascotas",

      cantidad:
        mascotas * dias,

      precio:
        preciosMochila.aguaMascota

    });


    items.push({

      nombre:"🐾 Alimento para mascotas",

      cantidad:
        mascotas * dias * 2,

      precio:
        preciosMochila.alimentoMascota

    });

  }


  let totalProductos = 0;


  let filas = `

    <table class="budget-table">

      <thead>

        <tr>

          <th>Producto</th>

          <th>Cantidad</th>

          <th>Precio unitario</th>

          <th>Subtotal</th>

        </tr>

      </thead>

      <tbody>

  `;


  items.forEach(item=>{

    const subtotal =
      item.cantidad * item.precio;


    totalProductos += subtotal;


    filas += `

      <tr>

        <td>
          ${item.nombre}
        </td>

        <td>
          ${item.cantidad}
        </td>

        <td class="budget-price">

          S/ ${item.precio.toFixed(2)}

        </td>

        <td class="budget-subtotal">

          S/ ${subtotal.toFixed(2)}

        </td>

      </tr>

    `;

  });


  filas += `

      </tbody>

    </table>

  `;


  const costoMochila =
    preciosMochila.mochila;


  const total =
    totalProductos + costoMochila;


  $("tablaPresupuesto").innerHTML =
    filas;


  $("totalProductos").textContent =
    `S/ ${totalProductos.toFixed(2)}`;


  $("costoMochila").textContent =
    `S/ ${costoMochila.toFixed(2)}`;


  $("totalPresupuesto").textContent =
    `S/ ${total.toFixed(2)}`;

}


/* =========================
   CHECKLIST
========================= */

function renderChecklist(){

  const saved =
    JSON.parse(
      localStorage.getItem(
        "checkEstadoMochila"
      ) || "{}"
    );


  const list =
    checklistItems.length
      ? checklistItems
      : JSON.parse(
          localStorage.getItem(
            "checklistMochila"
          ) || "[]"
        );


  $("checklist").innerHTML =
    list.length

      ? list.map((item,i)=>`

          <label
            class="check-item ${saved[item] ? "done" : ""}"
          >

            <input
              type="checkbox"
              ${saved[item] ? "checked" : ""}
              onchange="toggleCheck(
                '${encodeURIComponent(item)}',
                this.checked
              )"
            >

            <span>
              ${item}
            </span>

          </label>

        `).join("")

      : `<p>Aún no has generado una mochila.</p>`;


  updateChecklistProgress();

}


function toggleCheck(
  encoded,
  checked
){

  const item =
    decodeURIComponent(encoded);


  const saved =
    JSON.parse(
      localStorage.getItem(
        "checkEstadoMochila"
      ) || "{}"
    );


  saved[item] = checked;


  localStorage.setItem(
    "checkEstadoMochila",
    JSON.stringify(saved)
  );


  renderChecklist();

}


function updateChecklistProgress(){

  const checks =
    document.querySelectorAll(
      ".check-item input"
    );


  const done =
    [...checks].filter(
      x=>x.checked
    ).length;


  const total =
    checks.length;


  const percent =
    total
      ? Math.round(
          done / total * 100
        )
      : 0;


  $("barraProgreso").style.width =
    percent + "%";


  $("textoProgreso").textContent =
    percent + "% preparado";


  $("contadorChecklist").textContent =
    `${done}/${total}`;


  $("statPreparacion").textContent =
    percent + "%";


  updateEvaluation();

}


/* =========================
   PLAN FAMILIAR
========================= */

function crearPlan(){

  const data = {

    familia:
      $("familia").value.trim(),

    responsable:
      $("responsable").value.trim(),

    contacto:
      $("contacto").value.trim(),

    telefono:
      $("telefono").value.trim(),

    punto:
      $("puntoEncuentro").value.trim(),

    ruta:
      $("ruta").value.trim()

  };


  if(
    !data.familia ||
    !data.responsable ||
    !data.punto
  ){

    $("planResultado").innerHTML = `

      <div class="result-box risk-note">

        Completa al menos integrantes,
        responsable y punto de encuentro.

      </div>

    `;

    return;

  }


  const planAnterior =
    localStorage.getItem(
      "planFamiliar"
    );


  localStorage.setItem(
    "planFamiliar",
    JSON.stringify(data)
  );


  $("planResultado").innerHTML = `

    <div class="result-box">

      <h3>
        ✅ Plan familiar guardado
      </h3>

      <p>
        <b>Familia:</b>
        ${escapeHTML(data.familia)}
      </p>

      <p>
        <b>Responsable:</b>
        ${escapeHTML(data.responsable)}
      </p>

      <p>
        <b>Contacto:</b>
        ${escapeHTML(
          data.contacto ||
          "No registrado"
        )}
        ·
        ${escapeHTML(
          data.telefono ||
          "Sin teléfono"
        )}
      </p>

      <p>
        <b>Punto de encuentro:</b>
        ${escapeHTML(data.punto)}
      </p>

      <p>
        <b>Ruta:</b>
        ${escapeHTML(
          data.ruta ||
          "No registrada"
        )}
      </p>

    </div>

  `;


  if(!planAnterior){

    puntos += 100;

    medallas.plan = true;

    saveStats();

  }

}


function cargarPlan(){

  const data =
    JSON.parse(
      localStorage.getItem(
        "planFamiliar"
      ) || "null"
    );


  if(!data)return;


  $("familia").value =
    data.familia || "";


  $("responsable").value =
    data.responsable || "";


  $("contacto").value =
    data.contacto || "";


  $("telefono").value =
    data.telefono || "";


  $("puntoEncuentro").value =
    data.punto || "";


  $("ruta").value =
    data.ruta || "";

}


/* =========================
   IMPRIMIR MOCHILA
========================= */

function imprimirMochila(){

  const personas =
    Math.max(
      1,
      Number($("personas").value) || 1
    );


  const dias =
    Math.max(
      1,
      Number($("dias").value) || 1
    );


  const ninos =
    Math.max(
      0,
      Number($("ninos").value) || 0
    );


  const adultos =
    Math.max(
      0,
      Number($("adultos").value) || 0
    );


  const discapacidad =
    Math.max(
      0,
      Number($("discapacidad").value) || 0
    );


  const mascotas =
    Math.max(
      0,
      Number($("mascotas").value) || 0
    );


  const riesgo =
    $("riesgo").selectedOptions[0].text;


  let items = [

    ["💧","Agua",personas*dias*2],

    ["🍪","Alimentos no perecibles",personas*dias*3],

    ["🔦","Linterna",1],

    ["🔋","Pilas o batería de respaldo",1],

    ["🩹","Botiquín",1],

    ["📻","Radio",1],

    ["📱","Teléfono y cargador",personas],

    ["📄","Documentos importantes",1],

    ["🧼","Artículos de higiene",personas],

    ["👕","Ropa de abrigo",personas],

    ["😷","Mascarillas",personas*2],

    ["🧻","Papel higiénico",personas*dias],

    ["🪣","Recipientes para agua",personas]

  ];


  if(ninos>0){

    items.push([
      "🧸",
      "Artículos para niños",
      ninos
    ]);

  }


  if(adultos>0){

    items.push([
      "🧓",
      "Artículos para adultos mayores",
      adultos
    ]);

  }


  if(discapacidad>0){

    items.push([
      "♿",
      "Artículos según necesidad",
      discapacidad
    ]);

  }


  if(mascotas>0){

    items.push([
      "🐶",
      "Agua para mascotas",
      mascotas*dias
    ]);


    items.push([
      "🐾",
      "Alimento para mascotas",
      mascotas*dias*2
    ]);

  }


  let container =
    document.getElementById(
      "printMochila"
    );


  if(!container){

    container =
      document.createElement("div");

    container.id =
      "printMochila";

    document.body.appendChild(
      container
    );

  }


  container.innerHTML = `

    <div class="print-header">

      <div class="print-logo">
        🎒 MochilaSegura
      </div>

      <div class="print-title">
        Mochila de emergencia
      </div>

    </div>


    <div class="print-info">

      <p>
        <strong>Personas:</strong>
        ${personas}
      </p>

      <p>
        <strong>Días:</strong>
        ${dias}
      </p>

      <p>
        <strong>Riesgo:</strong>
        ${riesgo}
      </p>

    </div>


    <div class="print-items">

      ${items.map(item=>`

        <div class="print-item">

          <strong>
            ${item[0]} ${item[1]}
          </strong>

          <div class="print-quantity">
            Cantidad: ${item[2]}
          </div>

        </div>

      `).join("")}

    </div>


    <div class="print-note">

      Revisa periódicamente los productos
      y reemplaza los que estén vencidos
      o deteriorados.

    </div>


    <div class="print-footer">

      MochilaSegura — Herramienta educativa
      de prevención y gestión de riesgos.

    </div>

  `;


  window.print();

}


/* =========================
   IMPRIMIR PLAN
========================= */

function imprimirPlan(){

  const data =
    JSON.parse(
      localStorage.getItem(
        "planFamiliar"
      ) || "null"
    );


  if(!data){

    alert(
      "Primero debes guardar tu plan familiar."
    );

    return;

  }


  let container =
    document.getElementById(
      "printPlan"
    );


  if(!container){

    container =
      document.createElement("div");

    container.id =
      "printPlan";

    document.body.appendChild(
      container
    );

  }


  container.innerHTML = `

    <div class="print-header">

      <div class="print-logo">
        🎒 MochilaSegura
      </div>

      <div class="print-title">
        Plan familiar de emergencia
      </div>

    </div>


    <div class="print-info">

      <p>
        <strong>Integrantes:</strong>
        ${escapeHTML(data.familia)}
      </p>

      <p>
        <strong>Responsable:</strong>
        ${escapeHTML(data.responsable)}
      </p>

      <p>
        <strong>Contacto:</strong>
        ${escapeHTML(data.contacto || "No registrado")}
      </p>

      <p>
        <strong>Teléfono:</strong>
        ${escapeHTML(data.telefono || "No registrado")}
      </p>

      <p>
        <strong>Punto de encuentro:</strong>
        ${escapeHTML(data.punto)}
      </p>

      <p>
        <strong>Ruta de evacuación:</strong>
        ${escapeHTML(data.ruta || "No registrada")}
      </p>

    </div>


    <div class="print-note">

      Todos los integrantes deben conocer
      el punto de encuentro y la ruta de evacuación.

    </div>


    <div class="print-footer">

      MochilaSegura — Plan familiar de prevención.

    </div>

  `;


  window.print();

}


/* =========================
   SIMULADORES
========================= */

const simData = {

  terremoto:{
    titulo:"🌎 Simulador de terremoto",
    preguntas:[

      [
        "Comienza un movimiento fuerte. ¿Qué haces?",

        [
          "😌 Mantener la calma y buscar un lugar seguro",
          "🏃 Correr sin observar",
          "🪟 Acercarte a las ventanas",
          "🛗 Usar el ascensor"
        ],

        0
      ],

      [
        "Después del movimiento, ¿qué conviene hacer?",

        [
          "📋 Seguir el plan familiar y las indicaciones oficiales",
          "🔙 Regresar inmediatamente",
          "📱 Compartir rumores",
          "🚪 Bloquear las salidas"
        ],

        0
      ]

    ]
  },


  incendio:{
    titulo:"🔥 Simulador de incendio",
    preguntas:[

      [
        "Si debes evacuar, ¿qué haces?",

        [
          "🚪 Salir por una ruta segura",
          "📦 Regresar por objetos",
          "🛗 Usar el ascensor",
          "🪟 Acercarte al humo"
        ],

        0
      ],

      [
        "¿Qué debes evitar?",

        [
          "🔥 Acercarte al área afectada",
          "🚶 Seguir una ruta segura",
          "📢 Avisar a los demás",
          "👨‍👩‍👧 Mantenerse con el grupo"
        ],

        0
      ]

    ]
  },


  inundacion:{
    titulo:"🌊 Simulador de inundación",
    preguntas:[

      [
        "El agua comienza a subir. ¿Qué haces?",

        [
          "⬆️ Alejarte de zonas inundadas y seguir indicaciones",
          "🌊 Caminar por corriente fuerte",
          "⚡ Acercarte a cables",
          "📸 Ir a observar"
        ],

        0
      ],

      [
        "¿Qué debes evitar?",

        [
          "🌊 Cruzar zonas con corriente de agua",
          "📻 Escuchar información oficial",
          "🎒 Tener preparada la mochila",
          "👨‍👩‍👧 Seguir el plan"
        ],

        0
      ]

    ]
  },


  huaico:{
    titulo:"⛰️ Simulador de huaico",
    preguntas:[

      [
        "Hay una alerta de huaico. ¿Qué haces?",

        [
          "🚶 Alejarte de quebradas y zonas de peligro",
          "🌊 Acercarte al cauce",
          "📸 Ir a mirar",
          "🏕️ Quedarte en una zona de riesgo"
        ],

        0
      ],

      [
        "¿Qué debes seguir?",

        [
          "📢 Las indicaciones oficiales",
          "💬 Rumores",
          "🎲 Decisiones al azar",
          "📱 Mensajes sin verificar"
        ],

        0
      ]

    ]
  }

};


let simActual = null;
let simPregunta = 0;
let simPuntos = 0;


function iniciarSimulador(tipo){

  simActual =
    simData[tipo];

  simPregunta = 0;
  simPuntos = 0;


  $("simuladorTitulo").textContent =
    simActual.titulo;


  mostrarPreguntaSim();

}


function mostrarPreguntaSim(){

  const q =
    simActual.preguntas[
      simPregunta
    ];


  $("simuladorTexto").innerHTML = `

    <div class="sim-question">

      <strong>
        ${q[0]}
      </strong>

      ${q[1].map(
        (op,i)=>`

          <button
            class="sim-option"
            onclick="responderSim(${i})"
          >
            ${op}
          </button>

        `
      ).join("")}

    </div>

  `;


  $("simuladorResultado").textContent = "";

}


function responderSim(index){

  const q =
    simActual.preguntas[
      simPregunta
    ];


  const buttons =
    document.querySelectorAll(
      ".sim-option"
    );


  buttons.forEach(
    b=>b.disabled=true
  );


  if(index===q[2]){

    buttons[index].classList.add(
      "correct"
    );


    simPuntos += 30;


    $("simuladorResultado").textContent =
      "✅ ¡Correcto! +30 puntos";

  }else{

    buttons[index].classList.add(
      "wrong"
    );


    buttons[q[2]].classList.add(
      "correct"
    );


    $("simuladorResultado").textContent =
      "❌ Respuesta incorrecta.";

  }


  setTimeout(()=>{

    simPregunta++;


    if(
      simPregunta >=
      simActual.preguntas.length
    ){

      puntos += simPuntos + 50;

      medallas.simulador = true;

      saveStats();


      $("simuladorResultado").textContent =
        `🎉 Simulación completada. +${simPuntos + 50} puntos`;

    }else{

      mostrarPreguntaSim();

    }

  },900);

}


/* =========================
   NIVELES DEL JUEGO
========================= */

const niveles = [

  {
    emoji:"🎒",
    title:"Preparación",
    intro:"Aprende los elementos básicos de una mochila de emergencia.",
    questions:[

      [
        "¿Qué elemento ayuda a tener iluminación si se corta la energía?",

        [
          "🔦 Linterna",
          "🎮 Consola",
          "🎧 Audífonos",
          "🧸 Juguete"
        ],

        0
      ],

      [
        "¿Qué conviene hacer con la mochila?",

        [
          "📍 Mantenerla accesible",
          "🔒 Guardarla donde nadie la encuentre",
          "☀️ Dejarla a la intemperie",
          "🧳 Guardarla sin revisar"
        ],

        0
      ],

      [
        "¿Qué debe considerarse al preparar una mochila?",

        [
          "👨‍👩‍👧‍👦 Las necesidades de la familia",
          "🎲 Solo objetos de entretenimiento",
          "🍬 Solo dulces",
          "👟 Solo ropa"
        ],

        0
      ]

    ]
  },


  {
    emoji:"🌎",
    title:"Terremoto",
    intro:"Toma decisiones durante una situación de movimiento fuerte.",
    questions:[

      [
        "Comienza un terremoto. ¿Qué haces?",

        [
          "😌 Mantener la calma y buscar un lugar seguro",
          "🏃 Correr sin observar",
          "🪟 Acercarte a las ventanas",
          "🛗 Usar el ascensor"
        ],

        0
      ],

      [
        "Durante el movimiento, ¿qué conviene evitar?",

        [
          "🪟 Zonas cercanas a vidrios u objetos que puedan caer",
          "🧘 Mantener la calma",
          "🛡️ Protegerte en una zona segura",
          "👂 Escuchar indicaciones"
        ],

        0
      ],

      [
        "Después, ¿qué debes hacer?",

        [
          "📋 Seguir el plan familiar y las indicaciones oficiales",
          "🔙 Volver inmediatamente a una zona de riesgo",
          "📱 Compartir rumores",
          "🚪 Bloquear las salidas"
        ],

        0
      ]

    ]
  },


  {
    emoji:"🔥",
    title:"Incendio",
    intro:"Aprende a responder ante una situación de incendio.",
    questions:[

      [
        "Si debes evacuar, ¿qué haces?",

        [
          "🚪 Salir por una ruta segura",
          "📦 Regresar por objetos",
          "🛗 Usar el ascensor",
          "🪟 Acercarte al humo"
        ],

        0
      ],

      [
        "¿Qué es importante durante la evacuación?",

        [
          "😌 Mantener la calma y seguir indicaciones",
          "📸 Detenerse a grabar",
          "🏃 Empujar a otras personas",
          "🔙 Regresar"
        ],

        0
      ],

      [
        "¿Qué debes evitar?",

        [
          "🔥 Acercarte al área afectada",
          "🚶 Seguir una ruta segura",
          "📢 Avisar a los demás",
          "👨‍👩‍👧 Mantenerse con el grupo"
        ],

        0
      ]

    ]
  },


  {
    emoji:"🌊",
    title:"Inundación",
    intro:"Identifica decisiones seguras frente a una inundación.",
    questions:[

      [
        "El agua comienza a subir. ¿Qué haces?",

        [
          "⬆️ Alejarte de zonas inundadas y seguir indicaciones",
          "🌊 Caminar por corriente fuerte",
          "⚡ Acercarte a cables",
          "📸 Ir a observar"
        ],

        0
      ],

      [
        "¿Qué debes evitar?",

        [
          "🌊 Cruzar zonas con corriente de agua",
          "📻 Escuchar información oficial",
          "🎒 Tener preparada la mochila",
          "👨‍👩‍👧 Seguir el plan"
        ],

        0
      ],

      [
        "¿Qué información es más útil?",

        [
          "📢 Alertas oficiales",
          "💬 Rumores",
          "📱 Mensajes sin verificar",
          "🎲 Adivinanzas"
        ],

        0
      ]

    ]
  },


  {
    emoji:"⛰️",
    title:"Huaico",
    intro:"Reconoce las decisiones adecuadas ante el riesgo de huaico.",
    questions:[

      [
        "Hay una alerta de huaico. ¿Qué haces?",

        [
          "🚶 Alejarte de quebradas y zonas de peligro",
          "🌊 Acercarte al cauce",
          "📸 Ir a mirar",
          "🏕️ Quedarte en una zona de riesgo"
        ],

        0
      ],

      [
        "¿Qué debes seguir?",

        [
          "📢 Las indicaciones oficiales",
          "💬 Rumores",
          "🎲 Decisiones al azar",
          "📱 Mensajes sin verificar"
        ],

        0
      ],

      [
        "¿Qué ayuda a prepararse?",

        [
          "🎒 Tener mochila y plan familiar preparados",
          "🛋️ No hacer nada",
          "🚫 Ignorar alertas",
          "📦 Guardar la mochila lejos"
        ],

        0
      ]

    ]
  },


  {
    emoji:"🌧️",
    title:"Lluvias intensas",
    intro:"Prepárate y toma decisiones ante lluvias fuertes.",
    questions:[

      [
        "Antes de lluvias intensas, ¿qué puedes hacer?",

        [
          "🎒 Revisar la mochila y el plan familiar",
          "🌊 Acercarte a ríos",
          "🚶 Buscar zonas inundadas",
          "📱 Ignorar alertas"
        ],

        0
      ],

      [
        "¿Qué información debes revisar?",

        [
          "📢 Alertas y recomendaciones oficiales",
          "💬 Rumores",
          "🎲 Juegos",
          "📸 Videos sin contexto"
        ],

        0
      ],

      [
        "¿Qué zona conviene evitar si presenta peligro?",

        [
          "🌊 Zonas inundables o de riesgo",
          "🏠 Una zona segura",
          "📍 Un punto de encuentro",
          "🎒 El lugar donde está la mochila"
        ],

        0
      ]

    ]
  },


  {
    emoji:"👨‍👩‍👧‍👦",
    title:"Evacuación familiar",
    intro:"Aprende a organizar una evacuación con tu familia.",
    questions:[

      [
        "¿Qué debe conocer la familia?",

        [
          "📍 El punto de encuentro y la ruta",
          "🎮 Solo un juego",
          "📸 Una fotografía",
          "🎲 Una decisión al azar"
        ],

        0
      ],

      [
        "Si debes evacuar, ¿qué haces?",

        [
          "🚪 Salir por una ruta segura",
          "📦 Regresar por objetos",
          "🛗 Usar el ascensor",
          "🪟 Acercarte al humo"
        ],

        0
      ],

      [
        "¿Qué es importante durante la evacuación?",

        [
          "😌 Mantener la calma y seguir indicaciones",
          "📸 Detenerse a grabar",
          "🏃 Empujar a otras personas",
          "🔙 Regresar"
        ],

        0
      ]

    ]
  },


  {
    emoji:"🌙",
    title:"Emergencia nocturna",
    intro:"Prepárate para responder durante una emergencia de noche.",
    questions:[

      [
        "¿Qué elemento ayuda a tener iluminación?",

        [
          "🔦 Linterna",
          "🎮 Consola",
          "🎧 Audífonos",
          "🧸 Juguete"
        ],

        0
      ],

      [
        "¿Qué debes mantener preparado?",

        [
          "🎒 Mochila accesible",
          "📦 Objetos escondidos",
          "🎲 Solo juguetes",
          "🛋️ Nada"
        ],

        0
      ],

      [
        "¿Qué información puede ser útil?",

        [
          "📢 Indicaciones oficiales",
          "💬 Rumores",
          "🎲 Mensajes inventados",
          "📸 Videos sin verificar"
        ],

        0
      ]

    ]
  },


  {
    emoji:"🚨",
    title:"Emergencia combinada",
    intro:"Ahora tendrás que tomar decisiones ante varios riesgos.",
    questions:[

      [
        "Hay lluvia intensa y riesgo de inundación. ¿Qué haces?",

        [
          "📢 Sigues alertas y evitas zonas de riesgo",
          "🌊 Te acercas al agua",
          "📸 Vas a observar",
          "🚶 Cruzas zonas inundadas"
        ],

        0
      ],

      [
        "También debes evacuar con tu familia. ¿Qué priorizas?",

        [
          "👨‍👩‍👧 Seguir el plan familiar y reunirse en un punto seguro",
          "🏃 Separarte del grupo",
          "📦 Regresar por objetos",
          "📱 Ignorar indicaciones"
        ],

        0
      ],

      [
        "¿Qué información debes compartir?",

        [
          "📢 Información oficial y útil",
          "💬 Rumores",
          "🎲 Mensajes inventados",
          "📸 Contenido sin verificar"
        ],

        0
      ],

      [
        "¿Qué objeto ayuda a estar preparado?",

        [
          "🎒 Mochila de emergencia",
          "🎮 Consola",
          "🧸 Juguete",
          "🎧 Audífonos"
        ],

        0
      ]

    ]
  },


  {
    emoji:"🏆",
    title:"Gran simulación final",
    intro:"Has llegado a la misión final. Demuestra todo lo aprendido.",
    questions:[

      [
        "¿Qué debes hacer primero ante una emergencia?",

        [
          "😌 Mantener la calma y evaluar la situación",
          "🏃 Correr sin pensar",
          "📸 Grabar",
          "💬 Crear rumores"
        ],

        0
      ],

      [
        "¿Qué ayuda antes de una emergencia?",

        [
          "🎒 Mochila y plan familiar preparados",
          "🚫 Ignorar alertas",
          "📦 No organizar nada",
          "🎲 Esperar sin plan"
        ],

        0
      ],

      [
        "Durante un terremoto, ¿qué debes priorizar?",

        [
          "🛡️ Tu seguridad y seguir recomendaciones",
          "🪟 Acercarte a ventanas",
          "🛗 Usar ascensor",
          "📦 Recoger objetos"
        ],

        0
      ],

      [
        "Ante una inundación, ¿qué debes evitar?",

        [
          "🌊 Zonas inundadas y corrientes de agua",
          "📢 Alertas",
          "🎒 Mochila",
          "👨‍👩‍👧 Plan familiar"
        ],

        0
      ],

      [
        "Ante un huaico, ¿qué es importante?",

        [
          "⛰️ Alejarse de zonas de peligro y seguir la evacuación",
          "🌊 Acercarse al cauce",
          "📸 Observar",
          "🏕️ Permanecer en la zona de riesgo"
        ],

        0
      ],

      [
        "¿Qué hace que un plan familiar sea útil?",

        [
          "👨‍👩‍👧 Que todos conozcan qué hacer y dónde reunirse",
          "❌ Que solo lo conozca una persona",
          "🎲 Que sea improvisado",
          "📱 Que no esté actualizado"
        ],

        0
      ]

    ]
  }

];


let juego = {

  nivel:nivelDesbloqueado,

  pregunta:0,

  vidas:3,

  tiempo:0,

  interval:null,

  activo:false,

  puntosNivel:0

};


/* =========================
   GRID DE NIVELES
========================= */

function renderLevelGrid(){

  const grid =
    $("levelGrid");


  grid.innerHTML =
    niveles.map((n,i)=>{

      const num = i + 1;

      const unlocked =
        num <= nivelDesbloqueado;

      const completed =
        num <= nivelesCompletados;


      return `

        <button
          class="
            level-btn
            ${unlocked ? "unlocked" : ""}
            ${completed ? "completed" : ""}
            ${num===juego.nivel ? "current" : ""}
          "

          ${
            unlocked
              ? `onclick="seleccionarNivel(${num})"`
              : "disabled"
          }
        >

          ${
            completed
              ? "🏅"
              : unlocked
              ? n.emoji
              : "🔒"
          }

          <br>

          ${num}

        </button>

      `;

    }).join("");

}


/* =========================
   SELECCIONAR NIVEL
========================= */

function seleccionarNivel(num){

  if(num > nivelDesbloqueado){
    return;
  }


  detenerTemporizador();


  juego = {

    nivel:num,

    pregunta:0,

    vidas:3,

    tiempo:0,

    interval:null,

    activo:false,

    puntosNivel:0

  };


  mostrarNivelPreparacion();

  renderLevelGrid();

}


function mostrarNivelPreparacion(){

  const n =
    niveles[juego.nivel-1];


  $("nivelJuego").textContent =
    juego.nivel;


  $("puntosJuego").textContent =
    puntos.toLocaleString();


  $("vidasJuego").textContent =
    "❤️❤️❤️";


  $("tiempoJuego").textContent =
    "--";


  $("nivelEmoji").textContent =
    n.emoji;


  $("tituloMision").textContent =
    `Nivel ${juego.nivel} — ${n.title}`;


  $("descripcionMision").textContent =
    n.intro;


  $("missionBar").style.width =
    "0%";


  $("objetosJuego").innerHTML =
    "";


  $("mensajeJuego").textContent =
    "";


  $("btnIniciar").textContent =
    "▶️ Iniciar nivel";


  $("btnIniciar").style.display =
    "inline-block";


  $("nivelCompletado")
    .classList.add("hidden");

}


/* =========================
   INICIAR JUEGO
========================= */

function iniciarJuego(){

  if(juego.activo){
    return;
  }


  juego.pregunta = 0;
  juego.vidas = 3;
  juego.puntosNivel = 0;
  juego.activo = true;


  $("btnIniciar").style.display =
    "none";


  mostrarPreguntaJuego();

  iniciarTemporizador();

}


function mostrarPreguntaJuego(){

  const n =
    niveles[juego.nivel-1];


  const q =
    n.questions[juego.pregunta];


  $("nivelJuego").textContent =
    juego.nivel;


  $("vidasJuego").textContent =
    "❤️".repeat(juego.vidas) +
    "🖤".repeat(3-juego.vidas);


  $("puntosJuego").textContent =
    puntos.toLocaleString();


  $("tituloMision").textContent =
    `Nivel ${juego.nivel} — ${n.title}`;


  $("descripcionMision").textContent =
    `Pregunta ${juego.pregunta+1} de ${n.questions.length}: ${q[0]}`;


  $("missionBar").style.width =
    (
      juego.pregunta /
      n.questions.length *
      100
    ) + "%";


  $("objetosJuego").innerHTML =

    q[1].map(
      (op,i)=>`

        <button
          class="game-option"
          onclick="responderJuego(${i})"
        >
          ${String.fromCharCode(65+i)})
          ${op}
        </button>

      `
    ).join("");


  $("mensajeJuego").textContent =
    "";

}


/* =========================
   TEMPORIZADOR
========================= */

function iniciarTemporizador(){

  juego.tiempo = 50;


  $("tiempoJuego").textContent =
    juego.tiempo + "s";


  detenerTemporizador();


  juego.interval =
    setInterval(()=>{

      juego.tiempo--;


      $("tiempoJuego").textContent =
        juego.tiempo + "s";


      if(juego.tiempo<=0){

        detenerTemporizador();

        juego.activo = false;

        fallarNivel(
          "⏱️ ¡Se acabó el tiempo!"
        );

      }

    },1000);

}


function detenerTemporizador(){

  if(juego.interval){

    clearInterval(
      juego.interval
    );

    juego.interval = null;

  }

}


/* =========================
   RESPONDER JUEGO
========================= */

function responderJuego(index){

  if(!juego.activo){
    return;
  }


  const q =
    niveles[
      juego.nivel-1
    ].questions[
      juego.pregunta
    ];


  const buttons =
    [
      ...document.querySelectorAll(
        ".game-option"
      )
    ];


  buttons.forEach(
    b=>b.disabled=true
  );


  const correct =
    index === q[2];


  buttons[index].classList.add(
    correct
      ? "correct"
      : "wrong"
  );


  if(correct){

    const gain = 100;

    puntos += gain;

    juego.puntosNivel += gain;


    $("mensajeJuego").textContent =
      `🎉 ¡Correcto! +${gain} puntos`;


    setTimeout(()=>{

      juego.pregunta++;


      if(
        juego.pregunta >=
        niveles[
          juego.nivel-1
        ].questions.length
      ){

        completarNivel();

      }else{

        mostrarPreguntaJuego();

      }

    },700);


  }else{

    juego.vidas--;


    $("mensajeJuego").textContent =
      "❌ Respuesta incorrecta. Pierdes una vida.";


    $("vidasJuego").textContent =
      "❤️".repeat(juego.vidas) +
      "🖤".repeat(3-juego.vidas);


    if(juego.vidas<=0){

      setTimeout(()=>{

        detenerTemporizador();

        juego.activo = false;

        fallarNivel(
          "💔 Te quedaste sin vidas."
        );

      },700);

    }else{

      setTimeout(
        ()=>mostrarPreguntaJuego(),
        900
      );

    }

  }

}


/* =========================
   COMPLETAR NIVEL
========================= */

function completarNivel(){

  detenerTemporizador();

  juego.activo = false;


  const bonus = 300;


  const timeBonus =
    Math.max(
      0,
      juego.tiempo * 5
    );


  const lifeBonus =
    juego.vidas * 50;


  const totalBonus =
    bonus +
    timeBonus +
    lifeBonus;


  puntos += totalBonus;


  nivelesCompletados =
    Math.max(
      nivelesCompletados,
      juego.nivel
    );


  if(juego.nivel<10){

    nivelDesbloqueado =
      Math.max(
        nivelDesbloqueado,
        juego.nivel+1
      );

  }else{

    nivelDesbloqueado = 10;

  }


  if(puntos > mejorPuntuacion){

    mejorPuntuacion = puntos;

  }


  const title =
    getTitle(juego.nivel);


  medallas[
    "nivel" + juego.nivel
  ] = true;


  if(juego.nivel===10){

    medallas.final = true;

  }


  saveStats();


  $("missionBar").style.width =
    "100%";


  $("nivelCompletado")
    .classList.remove("hidden");


  $("nivelCompletado").innerHTML = `

    <div style="font-size:60px">
      🎉🏆
    </div>

    <h2>
      ¡Nivel ${juego.nivel} completado!
    </h2>

    <div class="reward">
      <b>${title}</b>
    </div>

    <p>
      ⭐ Puntos del nivel:
      ${juego.puntosNivel}
    </p>

    <p>
      🎁 Bonificación:
      +${totalBonus} puntos
    </p>

    <p>
      ❤️ Vidas restantes:
      ${juego.vidas}
    </p>

    ${
      juego.nivel<10

      ?

      `

        <p style="margin-top:12px">

          <b>
            🔓 ¡Nivel ${juego.nivel+1} desbloqueado!
          </b>

        </p>

        <button
          class="btn"
          onclick="seleccionarNivel(${juego.nivel+1})"
        >
          ➡️ Continuar al nivel
          ${juego.nivel+1}
        </button>

      `

      :

      `

        <p style="margin-top:12px">

          <b>
            👑 ¡EXPERTO EN GESTIÓN DE RIESGOS!
          </b>

        </p>

        <p>
          ⭐ Puntuación final:
          <b>
            ${puntos.toLocaleString()}
          </b>
        </p>

        <button
          class="btn"
          onclick="seleccionarNivel(10)"
        >
          🔄 Jugar nivel final
        </button>

      `
    }

  `;


  renderLevelGrid();

}


/* =========================
   FALLAR NIVEL
========================= */

function fallarNivel(msg){

  $("nivelCompletado")
    .classList.remove("hidden");


  $("nivelCompletado").innerHTML = `

    <div style="font-size:55px">
      🔄
    </div>

    <h2>
      ${msg}
    </h2>

    <p>
      No pierdes los niveles que ya desbloqueaste.
    </p>

    <button
      class="btn"
      onclick="seleccionarNivel(${juego.nivel})"
    >
      🔄 Intentar de nuevo
    </button>

  `;


  $("objetosJuego").innerHTML =
    "";

}


function reiniciarJuego(){

  seleccionarNivel(
    juego.nivel
  );

}


/* =========================
   TÍTULOS
========================= */

function getTitle(n){

  return [

    "🎒 ¡Preparado para la misión!",

    "🌎 ¡Aprendiz de prevención!",

    "🔥 ¡Guardián de la seguridad!",

    "🌊 ¡Experto en emergencias!",

    "⛰️ ¡Héroe de la prevención!",

    "🌧️ ¡Maestro de la preparación!",

    "👨‍👩‍👧‍👦 ¡Protector de la familia!",

    "🌙 ¡Experto en situaciones difíciles!",

    "🚨 ¡Especialista en emergencias!",

    "👑 ¡EXPERTO EN GESTIÓN DE RIESGOS!"

  ][n-1];

}


/* =========================
   LOGROS
========================= */

const achievementData = [

  [
    "plan",
    "👨‍👩‍👧‍👦",
    "Plan familiar",
    "Crea y guarda tu plan familiar."
  ],

  [
    "simulador",
    "🚨",
    "Simulador",
    "Completa una simulación."
  ],

  [
    "nivel1",
    "🎒",
    "Primera misión",
    "Completa el nivel 1."
  ],

  [
    "nivel3",
    "🔥",
    "Guardián",
    "Completa el nivel 3."
  ],

  [
    "nivel5",
    "⛰️",
    "Héroe",
    "Completa el nivel 5."
  ],

  [
    "nivel7",
    "👨‍👩‍👧‍👦",
    "Protector",
    "Completa el nivel 7."
  ],

  [
    "nivel10",
    "👑",
    "Experto",
    "Completa los 10 niveles."
  ]

];


function renderAchievements(){

  $("logrosContainer").innerHTML =

    achievementData.map(a=>`

      <article
        class="
          achievement
          ${medallas[a[0]] ? "" : "locked"}
        "
      >

        <span>
          ${a[1]}
        </span>

        <h3>
          ${a[2]}
        </h3>

        <p>

          ${
            medallas[a[0]]
              ? "🏅 ¡Desbloqueado!"
              : a[3]
          }

        </p>

      </article>

    `).join("");

}


/* =========================
   EVALUACIÓN
========================= */

function updateEvaluation(){

  const plan =
    localStorage.getItem(
      "planFamiliar"
    )
      ? 1
      : 0;


  const checks =
    document.querySelectorAll(
      ".check-item input"
    );


  const checkPercent =
    checks.length

      ? (
          [
            ...checks
          ].filter(
            x=>x.checked
          ).length /
          checks.length
        )

      : 0;


  const gamePercent =
    nivelesCompletados / 10;


  const percent =
    Math.round(

      checkPercent * 40 +
      plan * 20 +
      gamePercent * 40

    );


  $("evaluacionPorcentaje").textContent =
    percent + "%";


  $("evaluacionTexto").textContent =

    percent>=80

      ? "🎉 Muy buen nivel de preparación."

      : percent>=50

      ? "👍 Vas avanzando. Sigue practicando."

      : "📚 Continúa completando la mochila, el plan y las misiones.";

}


/* =========================
   SEGURIDAD HTML
========================= */

function escapeHTML(str){

  return String(str).replace(
    /[&<>"']/g,

    m=>({

      "&":"&amp;",
      "<":"&lt;",
      ">":"&gt;",
      '"':"&quot;",
      "'":"&#039;"

    }[m])

  );

}


/* =========================
   CARGAR PÁGINA
========================= */

window.addEventListener(
  "DOMContentLoaded",
  ()=>{

    cargarPlan();


    checklistItems =
      JSON.parse(
        localStorage.getItem(
          "checklistMochila"
        ) || "[]"
      );


    renderChecklist();


    seleccionarNivel(
      nivelDesbloqueado
    );


    updateDashboard();

  }
);