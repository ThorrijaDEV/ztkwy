/* ============================================================
   CONFIGURACIÓN
   Lo único que probablemente necesites tocar está en este archivo.
   ============================================================ */

const CONFIG = {
  // --- Formspree: pega aquí tu endpoint ---
  formspreeEndpoint: 'https://formspree.io/f/mzedraby',

  // Clave del intento definitivo en el registro de Formspree
  finalAttemptNumber: 8,

  // Formato de las respuestas durante la broma
  jokeMessage: (answer) => `Todavía no, es la broma, pero ha dicho: ${answer}`,

  // Formato de la respuesta final
  finalMessage: (answer) => `RESPUESTA FINAL: ${answer}`,
};

/* ============================================================
   EL CUESTIONARIO
   Cada pantalla es una pregunta. El orden del array es el orden
   en el que Gabriela las va a ver.
   ============================================================ */

const SCREENS = [
  {
    id: 'intento-1',
    intento: 1,
    nota: 'La primera, la de verdad.',
    chaos: 0,
    lines: ['¿Me perdonas?'],
    buttons: [
      { label: 'SÍ', answer: 'SÍ' },
      { label: 'NO', answer: 'NO' },
    ],
  },
  {
    id: 'intento-1-confirmacion',
    intento: 1,
    nota: 'Leasks: ¿Seguro?',
    chaos: 0.06,
    lines: ['¿Seguro? 🥺'],
    buttons: [
      { label: 'Sí', answer: 'SÍ' },
      { label: 'No', answer: 'NO' },
    ],
  },
  {
    id: 'intento-2',
    intento: 2,
    nota: 'Vale... Piénsatelo otra vez.',
    chaos: 0.14,
    lines: ['Vale...', 'Piénsatelo otra vez.', '¿Me perdonas?'],
    buttons: [
      { label: 'Sí', answer: 'SÍ' },
      { label: 'No', answer: 'NO' },
    ],
  },
  {
    id: 'intento-3',
    intento: 3,
    nota: 'Te lo estoy preguntando en serio',
    chaos: 0.26,
    lines: ['Gabriela...', 'Te lo estoy preguntando en serio 😭', '¿Me perdonas?'],
    buttons: [
      { label: 'Sí', answer: 'SÍ' },
      { label: 'No', answer: 'NO' },
    ],
  },
  {
    id: 'intento-4',
    intento: 4,
    nota: 'He hecho una web entera para esto',
    chaos: 0.42,
    lines: ['POR FAVOR 😭', 'HE HECHO UNA WEB ENTERA PARA ESTO', '¿ME PERDONAS?'],
    buttons: [
      { label: 'SÍ', answer: 'SÍ' },
      { label: 'NO', answer: 'NO' },
    ],
  },
  {
    id: 'intento-5',
    intento: 5,
    nota: 'Estoy intentando mantener la dignidad',
    chaos: 0.55,
    lines: [
      'Gabriela.',
      'Por favor.',
      'Estoy intentando mantener la dignidad.',
      'PERO SE ME ESTÁ ACABANDO.',
      '¿Me perdonas?',
    ],
    buttons: [
      { label: 'SÍ', answer: 'SÍ' },
      { label: 'NO', answer: 'NO' },
    ],
  },
  {
    id: 'intento-6',
    intento: 6,
    nota: 'Ya estoy suplicando delante de unos botones',
    chaos: 0.68,
    lines: [
      'VENGA 😭😭😭',
      '¿QUÉ MÁS QUIERES DE MÍ?',
      'YA HE PEDIDO PERDÓN',
      'YA HE HECHO LA WEB',
      'YA ESTOY SUPLICANDO DELANTE DE UNOS BOTONES',
      '¿ME PERDONAS?',
    ],
    buttons: [
      { label: 'SÍ', answer: 'SÍ' },
      { label: 'NO', answer: 'NO' },
    ],
  },
  {
    id: 'intento-7',
    intento: 7,
    nota: 'Protocolo de emergencia',
    chaos: 0.82,
    lines: [
      'NO PUEDE SER.',
      '¿SIGUES DICIENDO QUE NO?',
      'ESTO SE NOS HA IDO DE LAS MANOS.',
      '🚨 PROTOCOLO DE EMERGENCIA 🚨',
      'POR FAVOR.',
      '¿ME PERDONAS?',
    ],
    buttons: [
      { label: 'SÍ', answer: 'SÍ' },
      { label: 'NO', answer: 'NO' },
    ],
    onNo: {
      lines: ['¿¿¿NO???', '😭', 'Vale.', 'Una última.'],
      pause: 1500,
    },
  },
  {
    id: 'intento-8',
    intento: 8,
    nota: 'Última pregunta, la de verdad. El NO es real.',
    chaos: 0.6,
    final: true,
    lines: [
      'Vale.',
      'Esta vez es de verdad.',
      'Última pregunta.',
      'Y prometo que después no habrá otra.',
      'Lo que elijas aquí sí me llegará como respuesta final.',
      '¿Me perdonas?',
    ],
    buttons: [
      { label: 'SÍ', answer: 'SÍ', tone: 'yes' },
      { label: 'SÍ', answer: 'SÍ', tone: 'yes' },
      { label: 'SÍ', answer: 'SÍ', tone: 'yes' },
      { label: 'SÍ', answer: 'SÍ', tone: 'yes' },
      { label: 'SÍ', answer: 'SÍ', tone: 'yes' },
      { label: 'SÍ', answer: 'SÍ', tone: 'yes' },
      { label: 'SÍ', answer: 'SÍ', tone: 'yes' },
      { label: 'SÍ', answer: 'SÍ', tone: 'yes' },
      { label: 'NO', answer: 'NO', tone: 'no' },
    ],
  },
];

window.CONFIG = CONFIG;
window.SCREENS = SCREENS;