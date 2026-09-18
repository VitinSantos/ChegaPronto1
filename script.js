let currentRole = 'paciente';
let currentReceptionView = 'atendente-dash';

const patientData = {
  victor: {
    name: 'Victor Santos',
    specialty: 'Cardiologia',
    convenio: 'Bradesco Saúde',
    age: '27',
    status: 'Carteirinha vencida',
    avatar: 'VS',
    protocol: 'CP-260915-024',
    senha: 'A-024'
  },

  mariana: {
    name: 'Mariana Costa',
    specialty: 'Dermatologia',
    convenio: 'Amil',
    age: '31',
    status: 'Pronto',
    avatar: 'MC',
    protocol: 'CP-260915-025',
    senha: 'A-025'
  },

  lucas: {
    name: 'Lucas Moreira',
    specialty: 'Ortopedia',
    convenio: 'Unimed',
    age: '42',
    status: 'Laudo pendente',
    avatar: 'LM',
    protocol: 'CP-260915-026',
    senha: 'A-026'
  }
};


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  document
    .getElementById('role-paciente')
    ?.addEventListener('click', () => selectRole('paciente'));

  document
    .getElementById('role-atendente')
    ?.addEventListener('click', () => selectRole('atendente'));

  document
    .getElementById('loginForm')
    ?.addEventListener('submit', handleLogin);


  /* -------------------------
     PACIENTE
  ------------------------- */

  document
    .getElementById('btnRevisarDados')
    ?.addEventListener('click', () => {
      openModal('modalEditarDados');
    });

  document
    .getElementById('btnOpenEditarDados')
    ?.addEventListener('click', () => {
      openModal('modalEditarDados');
    });

  document
    .getElementById('btnOpenAgendar')
    ?.addEventListener('click', () => {
      openModal('modalAgendar');
    });

  document
    .getElementById('btnOpenAgendarAlt')
    ?.addEventListener('click', () => {
      openModal('modalAgendar');
    });

  document
    .getElementById('goConvenios')
    ?.addEventListener('click', () => {
      navigate('convenios');
    });


  /* -------------------------
     PAGAMENTO
  ------------------------- */

  const agendaPagamento =
    document.getElementById('agenda-tipo-pagamento');

  if (agendaPagamento) {

    agendaPagamento.addEventListener('change', (event) => {

      const group =
        document.getElementById('group-metodo-particular');

      if (!group) return;

      group.style.display =
        event.target.value === 'Particular'
          ? 'block'
          : 'none';

    });

  }


  /* -------------------------
     CHAT
  ------------------------- */

  const attachBtn =
    document.getElementById('attach-doc-btn');

  const attachmentInput =
    document.getElementById('attachmentInput');

  if (attachBtn && attachmentInput) {

    attachBtn.addEventListener('click', () => {
      attachmentInput.click();
    });

    attachmentInput.addEventListener('change', () => {

      const file =
        attachmentInput.files?.[0];

      const preview =
        document.getElementById('attachmentPreview');

      if (!file || !preview) return;

      preview.innerHTML = `
        <span class="attachment-chip">
          <i data-lucide="paperclip" size="13"></i>
          ${escapeHtml(file.name)}
        </span>
      `;

      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }

    });

  }


  const chatSendBtn =
    document.getElementById('chat-send-btn');

  if (chatSendBtn) {

    chatSendBtn.addEventListener(
      'click',
      sendAtendenteMessage
    );

  }


  const chatInput =
    document.getElementById('chat-input');

  if (chatInput) {

    chatInput.addEventListener('keydown', (event) => {

      if (event.key === 'Enter') {
        event.preventDefault();
        sendAtendenteMessage();
      }

    });

  }


  /* -------------------------
     FORMULÁRIOS
  ------------------------- */

  document
    .getElementById('formEditarDados')
    ?.addEventListener(
      'submit',
      salvarEdicaoDados
    );

  document
    .getElementById('formAgendar')
    ?.addEventListener(
      'submit',
      salvarNovoAgendamento
    );


  /* -------------------------
     BUSCAS
  ------------------------- */

  document
    .getElementById('chatContactSearch')
    ?.addEventListener('input', (event) => {

      filterItems(
        '.contact-item',
        event.target.value
      );

    });


  document
    .getElementById('patientSearch')
    ?.addEventListener('input', (event) => {

      filterItems(
        '.directory-item',
        event.target.value
      );

    });


  document
    .getElementById('agendaSearch')
    ?.addEventListener('input', (event) => {

      filterTable(event.target.value);

    });

});


/* =========================================================
   SEGURANÇA
========================================================= */

function escapeHtml(value = '') {

  return value.replace(
    /[&<>'"]/g,
    character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#039;',
      '"': '&quot;'
    }[character])
  );

}


/* =========================================================
   TOAST
========================================================= */

function showToast(
  message,
  type = 'success'
) {

  const container =
    document.getElementById('toast-container');

  if (!container) return;

  const toast =
    document.createElement('div');

  toast.className =
    `toast toast-${type}`;

  toast.innerHTML = `
    <i
      data-lucide="${
        type === 'success'
          ? 'check-circle'
          : 'alert-circle'
      }"
      size="18">
    </i>

    <span>
      ${escapeHtml(message)}
    </span>
  `;

  container.appendChild(toast);

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  setTimeout(() => {
    toast.remove();
  }, 3500);

}


/* =========================================================
   SELEÇÃO DE PERFIL
========================================================= */

function selectRole(role) {

  currentRole = role;

  const paciente =
    document.getElementById('role-paciente');

  const atendente =
    document.getElementById('role-atendente');

  if (paciente) {
    paciente.classList.toggle(
      'selected',
      role === 'paciente'
    );
  }

  if (atendente) {
    atendente.classList.toggle(
      'selected',
      role === 'atendente'
    );
  }

  const userInput =
    document.getElementById('loginUser');

  if (userInput) {

    userInput.value =
      role === 'paciente'
        ? 'victor.santos@email.com'
        : 'atendente.central@clinica.com';

  }

}


/* =========================================================
   LOGIN
========================================================= */

function handleLogin(event) {

  event.preventDefault();

  const appHeader =
    document.getElementById('appHeader');

  if (appHeader) {
    appHeader.style.display = 'flex';
  }

  const nav =
    document.getElementById('navLinks');

  if (!nav) return;


  /* -------------------------
     LOGIN PACIENTE
  ------------------------- */

  if (currentRole === 'paciente') {

    nav.innerHTML = `

      <button
        class="nav-btn"
        onclick="navigate('paciente-dash')">

        Início

      </button>

      <button
        class="nav-btn"
        onclick="navigate('meus-dados')">

        Meus Dados

      </button>

      <button
        class="nav-btn"
        onclick="navigate('convenios')">

        Convênios Aceitos

      </button>

      <button
        class="nav-btn"
        onclick="logout()">

        Sair

      </button>

    `;

    navigate('paciente-dash');

  }


  /* -------------------------
     LOGIN ATENDENTE
  ------------------------- */

  else {

    nav.innerHTML = `

      <span class="header-role">

        <i
          data-lucide="headset"
          size="15">
        </i>

        Central de Recepção

      </span>

      <button
        class="nav-btn"
        onclick="logout()">

        Sair

      </button>

    `;

    navigate('atendente-dash');

  }

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

}


/* =========================================================
   NAVEGAÇÃO
========================================================= */

function navigate(viewId) {

  document
    .querySelectorAll('.view-section')
    .forEach(view => {

      view.classList.remove('active');

    });


  const target =
    document.getElementById(
      `view-${viewId}`
    );


  if (target) {

    target.classList.add('active');

  }


  /* -------------------------
     NAVEGAÇÃO RECEPÇÃO
  ------------------------- */

  if (viewId.startsWith('atendente-')) {

    currentReceptionView =
      viewId;


    document
      .querySelectorAll('.reception-view')
      .forEach(view => {

        view.classList.toggle(
          'reception-view-active',
          view.dataset.receptionView === viewId
        );

      });


    document
      .querySelectorAll('.side-nav-btn')
      .forEach(button => {

        button.classList.toggle(
          'active',
          button.dataset.view === viewId
        );

      });


    const titles = {

      'atendente-dash': [
        'Início',
        'Visão geral dos atendimentos de hoje.'
      ],

      'atendente-agenda': [
        'Agenda',
        'Senhas, protocolos e horários da fila de hoje.'
      ],

      'atendente-chat': [
        'Chat',
        'Converse com pacientes de forma organizada, como no WhatsApp.'
      ],

      'atendente-pacientes': [
        'Pacientes',
        'Consulte cadastro, protocolo e status de prontidão.'
      ],

      'atendente-relatorios': [
        'Relatórios',
        'Acompanhe indicadores e o fluxo da recepção.'
      ],

      'atendente-configuracoes': [
        'Configurações',
        'Ajuste as preferências da central.'
      ]

    };


    const current =
      titles[viewId] || [
        'Início',
        ''
      ];


    const title =
      document.getElementById(
        'reception-page-title'
      );

    const subtitle =
      document.getElementById(
        'reception-page-subtitle'
      );


    if (title) {
      title.textContent = current[0];
    }

    if (subtitle) {
      subtitle.textContent = current[1];
    }

  }


  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });


  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

}


/* =========================================================
   MODAIS
========================================================= */

function openModal(id) {

  const modal =
    document.getElementById(id);

  if (!modal) return;

  modal.classList.add('active');

  document.body.classList.add(
    'modal-open'
  );

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

}


function closeModal(id) {

  const modal =
    document.getElementById(id);

  if (!modal) return;

  modal.classList.remove('active');

  document.body.classList.remove(
    'modal-open'
  );

}


/* =========================================================
   CHAT DA RECEPÇÃO
========================================================= */

function selectChatContact(button) {

  document
    .querySelectorAll('.contact-item')
    .forEach(item => {

      item.classList.remove('active');

    });


  button.classList.add('active');


  const name =
    button.dataset.contact ||
    'Paciente';


  const contacts = {

    'Victor Santos':
      patientData.victor,

    'Mariana Costa':
      patientData.mariana,

    'Lucas Moreira':
      patientData.lucas,

    'Ana Souza': {

      name: 'Ana Souza',
      specialty: 'Clínica Geral',
      convenio: 'Bradesco Saúde',
      age: '29',
      avatar: 'AS',
      protocol: 'CP-260915-027',
      senha: 'A-027',
      status: 'Pronto'

    }

  };


  const patient =
    contacts[name] ||
    contacts['Victor Santos'];


  const currentName =
    document.getElementById(
      'chat-current-name'
    );

  const currentAvatar =
    document.getElementById(
      'chat-current-avatar'
    );

  const currentMeta =
    document.getElementById(
      'chat-current-meta'
    );


  if (currentName) {
    currentName.textContent =
      patient.name;
  }

  if (currentAvatar) {
    currentAvatar.textContent =
      patient.avatar;
  }

  if (currentMeta) {

    currentMeta.textContent =
      `${patient.convenio} · Protocolo ${patient.protocol}`;

  }


  const history =
    document.getElementById(
      'chatHistory'
    );


  if (!history) return;


  history.innerHTML = `

    <div class="chat-date">
      Hoje
    </div>


    <div class="message system-msg">

      Conversa com
      ${escapeHtml(patient.name)}
      selecionada.

    </div>


    <div class="message patient-msg">

      <p>
        Olá, preciso confirmar meu
        atendimento de hoje.
      </p>

      <span class="time">

        09:15 ·
        ${escapeHtml(
          patient.name.split(' ')[0]
        )}

      </span>

    </div>


    <div class="message atendente-msg">

      <p>

        Olá
        ${escapeHtml(
          patient.name.split(' ')[0]
        )}!

        Estou conferindo seus dados
        e já retorno.

      </p>

      <span class="time">

        09:18 · Atendente

      </span>

    </div>

  `;


  history.scrollTop =
    history.scrollHeight;

}


/* =========================================================
   ENVIAR MENSAGEM
========================================================= */

function sendAtendenteMessage() {

  const input =
    document.getElementById(
      'chat-input'
    );

  const history =
    document.getElementById(
      'chatHistory'
    );

  const fileInput =
    document.getElementById(
      'attachmentInput'
    );

  const preview =
    document.getElementById(
      'attachmentPreview'
    );


  if (
    !input ||
    !history
  ) {
    return;
  }


  const hasText =
    input.value.trim().length > 0;


  const hasFile =
    fileInput &&
    fileInput.files &&
    fileInput.files.length > 0;


  if (!hasText && !hasFile) {
    return;
  }


  const text =
    input.value.trim();


  const file =
    hasFile
      ? fileInput.files[0]
      : null;


  const message =
    document.createElement('div');


  message.className =
    'message atendente-msg';


  message.innerHTML = `

    <p>

      ${
        escapeHtml(
          text ||
          'Arquivo anexado para o paciente.'
        )
      }

    </p>

    ${
      file
        ? `
          <p>
            <strong>Anexo:</strong>
            ${escapeHtml(file.name)}
          </p>
        `
        : ''
    }

    <span class="time">

      Agora · Atendente

    </span>

  `;


  history.appendChild(message);


  input.value = '';


  if (preview) {
    preview.innerHTML = '';
  }


  if (fileInput) {
    fileInput.value = '';
  }


  history.scrollTop =
    history.scrollHeight;


  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }


  showToast(
    'Mensagem enviada com sucesso!',
    'success'
  );

}


/* =========================================================
   SELECIONAR PACIENTE
========================================================= */

function selectManagedPatient(button) {

  document
    .querySelectorAll('.directory-item')
    .forEach(item => {

      item.classList.remove('active');

    });


  button.classList.add('active');


  const name =
    button.dataset.name ||
    'Victor Santos';


  const initials =
    name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('');


  const avatar =
    document.getElementById(
      'managed-avatar'
    );

  const nameEl =
    document.getElementById(
      'managed-name'
    );

  const meta =
    document.getElementById(
      'managed-meta'
    );

  const status =
    document.getElementById(
      'managed-status'
    );


  if (avatar) {
    avatar.textContent =
      initials;
  }


  if (nameEl) {
    nameEl.textContent =
      name;
  }


  if (meta) {

    meta.textContent =
      `${button.dataset.specialty || 'Consulta'} · ${
        button.dataset.convenio || 'Convênio'
      } · ${
        name === 'Victor Santos'
          ? '27'
          : '31'
      } anos`;

  }


  if (status) {

    const statusText =
      button.dataset.status ||
      'Em análise';


    status.textContent =
      statusText;


    if (
      statusText === 'Pronto'
    ) {

      status.className =
        'status-badge status-ready';

    }

    else if (
      statusText
        .toLowerCase()
        .includes('pendente')
    ) {

      status.className =
        'status-badge status-review';

    }

    else {

      status.className =
        'status-badge status-warning';

    }

  }

}


/* =========================================================
   FILTROS
========================================================= */

function filterItems(
  selector,
  query
) {

  const search =
    query
      .toLowerCase()
      .trim();


  document
    .querySelectorAll(selector)
    .forEach(item => {

      const text =
        item.textContent
          .toLowerCase();


      item.style.display =
        text.includes(search)
          ? 'flex'
          : 'none';

    });

}


function filterTable(query) {

  const search =
    query
      .toLowerCase()
      .trim();


  document
    .querySelectorAll(
      '.data-table tbody tr'
    )
    .forEach(row => {

      const text =
        row.textContent
          .toLowerCase();


      row.style.display =
        text.includes(search)
          ? ''
          : 'none';

    });

}


/* =========================================================
   EDITAR DADOS DO PACIENTE
========================================================= */

function salvarEdicaoDados(event) {

  event.preventDefault();


  const getValue = id => {

    const element =
      document.getElementById(id);

    return element
      ? element.value
      : '';

  };


  const values = {

    nome: getValue('edit-nome'),

    tel: getValue('edit-telefone'),

    cep: getValue('edit-cep'),

    rua: getValue('edit-rua'),

    num: getValue('edit-numero'),

    comp: getValue('edit-complemento'),

    operadora: getValue('edit-operadora'),

    plano: getValue('edit-plano'),

    cart: getValue('edit-carteirinha'),

    val: getValue('edit-validade')

  };


  const map = {

    nome: 'view-nome',

    tel: 'view-telefone',

    cep: 'view-cep',

    rua: 'view-rua',

    num: 'view-numero',

    comp: 'view-complemento',

    operadora: 'view-operadora',

    plano: 'view-plano',

    cart: 'view-carteirinha'

  };


  Object
    .entries(map)
    .forEach(([key, id]) => {

      const element =
        document.getElementById(id);

      if (element) {
        element.innerText =
          values[key];
      }

    });


  /* -------------------------
     VALIDADE
  ------------------------- */

  if (values.val) {

    const parts =
      values.val.split('-');


    if (parts.length === 3) {

      const [
        year,
        month,
        day
      ] = parts;


      const formatted =
        `${day}/${month}/${year}`;


      const element =
        document.getElementById(
          'view-validade'
        );


      if (element) {

        element.innerText =
          formatted;

        element.classList.remove(
          'text-danger'
        );

      }

    }

  }


  /* -------------------------
     REMOVER ALERTA
  ------------------------- */

  const alert =
    document.getElementById(
      'modal-alert-divergencia'
    );


  if (alert) {
    alert.style.display = 'none';
  }


  document
    .getElementById(
      'group-validade'
    )
    ?.classList.remove(
      'field-error'
    );


  document
    .getElementById(
      'edit-validade'
    )
    ?.classList.remove(
      'input-danger'
    );


  /* -------------------------
     STATUS
  ------------------------- */

  const badge =
    document.getElementById(
      'badge-carteirinha'
    );


  if (badge) {

    badge.className =
      'badge badge-success';

    badge.innerText =
      'Carteirinha Validada';

  }


  const heroTitle =
    document.getElementById(
      'hero-status-title'
    );


  if (heroTitle) {

    heroTitle.innerText =
      'Cadastro 100% Pronto para Atendimento';

  }


  const gauge =
    document.getElementById(
      'readiness-gauge'
    );


  if (gauge) {

    gauge.className =
      'readiness-gauge green';

  }


  const score =
    document.getElementById(
      'gauge-score'
    );


  if (score) {
    score.innerText = '100%';
  }


  const check =
    document.getElementById(
      'check-convenio-item'
    );


  if (check) {

    check.className =
      'check-item verified';


    check.innerHTML = `

      <i
        data-lucide="check-circle-2"
        size="17">
      </i>

      Convênio & Carteirinha

    `;

  }


  const statusSub =
    document.getElementById(
      'dash-status-sub'
    );


  if (statusSub) {

    statusSub.innerText =
      'Todos os dados e validações do convênio foram efetuados com sucesso.';

  }


  const reviewButton =
    document.getElementById(
      'btnRevisarDados'
    );


  if (reviewButton) {
    reviewButton.style.display =
      'none';
  }


  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }


  closeModal(
    'modalEditarDados'
  );


  showToast(
    'Cadastro validado e atualizado com sucesso!',
    'success'
  );

}


/* =========================================================
   NOVO AGENDAMENTO
========================================================= */

function salvarNovoAgendamento(event) {

  event.preventDefault();


  const getValue = id => {

    const element =
      document.getElementById(id);

    return element
      ? element.value
      : '';

  };


  const especialidade =
    getValue(
      'agenda-especialidade'
    );


  const medico =
    getValue(
      'agenda-medico'
    );


  const dataRaw =
    getValue(
      'agenda-data'
    );


  const hora =
    getValue(
      'agenda-hora'
    );


  const tipoPagamento =
    getValue(
      'agenda-tipo-pagamento'
    );


  let pagamento =
    tipoPagamento;


  if (
    tipoPagamento === 'Particular'
  ) {

    pagamento =
      getValue(
        'agenda-metodo-particular'
      );

  }


  let dataFormatada =
    dataRaw;


  if (dataRaw) {

    const [
      year,
      month,
      day
    ] = dataRaw.split('-');


    dataFormatada =
      `${day}/${month}/${year}`;

  }


  const dashEspecialidade =
    document.getElementById(
      'dash-especialidade'
    );


  if (dashEspecialidade) {

    dashEspecialidade.innerText =
      especialidade;

  }


  const dashMedico =
    document.getElementById(
      'dash-medico'
    );


  if (dashMedico) {

    dashMedico.innerText =
      `${medico} · Unidade Central`;

  }


  const dashData =
    document.getElementById(
      'dash-data'
    );


  if (dashData) {

    dashData.innerText =
      dataFormatada;

  }


  const dashHora =
    document.getElementById(
      'dash-hora'
    );


  if (dashHora) {

    dashHora.innerText =
      hora;

  }


  const dashPagamento =
    document.getElementById(
      'dash-pagamento'
    );


  if (dashPagamento) {

    dashPagamento.innerText =
      pagamento;

  }


  closeModal(
    'modalAgendar'
  );


  showToast(
    'Agendamento confirmado com sucesso!',
    'success'
  );


  navigate(
    'paciente-dash'
  );

}


/* =========================================================
   MÉTODO DE PAGAMENTO
========================================================= */

function selectPaymentMethod(
  element,
  value
) {

  document
    .querySelectorAll('.payment-card')
    .forEach(card => {

      card.classList.remove(
        'selected'
      );

    });


  element.classList.add(
    'selected'
  );


  const input =
    document.getElementById(
      'agenda-metodo-particular'
    );


  if (input) {
    input.value = value;
  }

}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

  const header =
    document.getElementById(
      'appHeader'
    );


  if (header) {
    header.style.display =
      'none';
  }


  navigate(
    'login'
  );

}