let currentRole = 'paciente';

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  document.getElementById('role-paciente').addEventListener('click', () => selectRole('paciente'));
  document.getElementById('role-atendente').addEventListener('click', () => selectRole('atendente'));
  document.getElementById('loginForm').addEventListener('submit', handleLogin);

  const btnRevisar = document.getElementById('btnRevisarDados');
  if (btnRevisar) btnRevisar.addEventListener('click', () => openModal('modalEditarDados'));

  const btnOpenEditarDados = document.getElementById('btnOpenEditarDados');
  if (btnOpenEditarDados) btnOpenEditarDados.addEventListener('click', () => openModal('modalEditarDados'));

  const btnOpenAgendar = document.getElementById('btnOpenAgendar');
  if (btnOpenAgendar) btnOpenAgendar.addEventListener('click', () => openModal('modalAgendar'));

  const btnAlt = document.getElementById('btnOpenAgendarAlt');
  if (btnAlt) btnAlt.addEventListener('click', () => openModal('modalAgendar'));

  const goConvenios = document.getElementById('goConvenios');
  if (goConvenios) goConvenios.addEventListener('click', () => navigate('convenios'));

  const agendaPagamento = document.getElementById('agenda-tipo-pagamento');
  if (agendaPagamento) {
    agendaPagamento.addEventListener('change', (e) => {
      const groupPart = document.getElementById('group-metodo-particular');
      if (groupPart) {
        groupPart.style.display =
          (e.target.value === 'Particular') ? 'block' : 'none';
      }
    });
  }

  document.querySelectorAll('.patient-card').forEach(card => {
    card.addEventListener('click', () => selectAtendentePatient(card));
  });

  const uploadZone = document.getElementById('uploadZone');
  if (uploadZone) uploadZone.addEventListener('click', simulateUploadPdf);

  const triggerPdfUpload = document.getElementById('triggerPdfUpload');
  if (triggerPdfUpload) {
    triggerPdfUpload.addEventListener('click', simulateUploadPdf);
  }

  const attachBtn = document.getElementById('attach-doc-btn');
  const attachmentInput = document.getElementById('attachmentInput');

  if (attachBtn && attachmentInput) {
    attachBtn.addEventListener('click', () => attachmentInput.click());

    attachmentInput.addEventListener('change', () => {
      const file = attachmentInput.files && attachmentInput.files[0];
      if (!file) return;

      const preview = document.getElementById('attachmentPreview');

      if (preview) {
        preview.innerHTML = `
          <span class="attachment-chip">
            <i data-lucide="paperclip" size="12"></i>
            ${file.name}
          </span>
        `;

        lucide.createIcons();
      }
    });
  }

  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');

  if (chatSendBtn) {
    chatSendBtn.addEventListener('click', sendAtendenteMessage);
  }

  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendAtendenteMessage();
    });
  }

  const formEditar = document.getElementById('formEditarDados');
  if (formEditar) {
    formEditar.addEventListener('submit', salvarEdicaoDados);
  }

  const formAgendar = document.getElementById('formAgendar');
  if (formAgendar) {
    formAgendar.addEventListener('submit', salvarNovoAgendamento);
  }
});

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconName = type === 'success'
    ? 'check-circle'
    : 'alert-circle';

  toast.innerHTML = `
    <i data-lucide="${iconName}" size="18"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => toast.remove(), 4000);
}

function selectRole(role) {
  currentRole = role;

  document.getElementById('role-paciente').classList.remove('selected');
  document.getElementById('role-atendente').classList.remove('selected');

  document.getElementById(`role-${role}`).classList.add('selected');

  const userInput = document.getElementById('loginUser');

  userInput.value =
    (role === 'paciente')
      ? 'victor.santos@email.com'
      : 'atendente.central@clinica.com';
}

function handleLogin(e) {
  e.preventDefault();

  document.getElementById('appHeader').style.display = 'flex';

  const navLinks = document.getElementById('navLinks');

  if (currentRole === 'paciente') {
    navLinks.innerHTML = `
      <button class="nav-btn" onclick="navigate('paciente-dash')">
        Início
      </button>

      <button class="nav-btn" onclick="navigate('meus-dados')">
        Meus Dados
      </button>

      <button class="nav-btn" onclick="navigate('convenios')">
        Convênios Aceitos
      </button>

      <button class="nav-btn" onclick="logout()">
        Sair
      </button>
    `;

    navigate('paciente-dash');

  } else {
    navLinks.innerHTML = `
      <button class="nav-btn" onclick="navigate('atendente-dash')">
        Central de Prontidão
      </button>

      <button class="nav-btn" onclick="logout()">
        Sair
      </button>
    `;

    navigate('atendente-dash');
  }
}

function navigate(viewId) {
  document
    .querySelectorAll('.view-section')
    .forEach(view => view.classList.remove('active'));

  const targetView = document.getElementById(`view-${viewId}`);

  if (targetView) {
    targetView.classList.add('active');
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);

  if (modal) {
    modal.classList.add('active');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);

  if (modal) {
    modal.classList.remove('active');
  }
}

function updateCopilotInsights(
  patientName,
  specialty,
  convenio,
  statusText,
  dateText
) {
  const patientNameEl =
    document.getElementById('copilot-patient-name');

  const specialtyEl =
    document.getElementById('copilot-specialty');

  const dateEl =
    document.getElementById('copilot-date');

  const convenioEl =
    document.getElementById('copilot-convenio');

  const statusEl =
    document.getElementById('copilot-status');

  const recommendationEl =
    document.getElementById('ai-recommendation-text');

  const aiAlert =
    document.getElementById('ai-alert-convenio');

  if (patientNameEl) {
    patientNameEl.textContent = patientName;
  }

  if (specialtyEl) {
    specialtyEl.textContent = specialty;
  }

  if (dateEl) {
    dateEl.textContent = dateText;
  }

  if (convenioEl) {
    convenioEl.textContent = convenio;
  }

  if (statusEl) {
    statusEl.textContent = statusText;
  }

  if (recommendationEl) {
    recommendationEl.textContent = statusText.includes('EXPIRADA')
      ? `Solicitar ao paciente a atualização da carteirinha e enviar o comprovante digital antes do atendimento para evitar retenção no guichê.`
      : 'Paciente com documentação validada. Nenhuma ação adicional necessária no ponto de atendimento.';
  }

  if (aiAlert) {
    aiAlert.classList.toggle(
      'success',
      !statusText.includes('EXPIRADA')
    );

    aiAlert.classList.toggle(
      'danger',
      statusText.includes('EXPIRADA')
    );

    const icon = aiAlert.querySelector('i');

    if (icon) {
      icon.setAttribute(
        'data-lucide',
        statusText.includes('EXPIRADA')
          ? 'x'
          : 'check'
      );

      lucide.createIcons();
    }
  }
}

function selectAtendentePatient(card) {
  document
    .querySelectorAll('.patient-card')
    .forEach(item => item.classList.remove('active'));

  card.classList.add('active');

  const name =
    card.dataset.name || 'Paciente';

  const specialty =
    card.dataset.specialty || 'Consulta';

  const convenio =
    card.dataset.convenio || 'Convênio';

  const age =
    card.dataset.age || 'Idade';

  const status =
    card.dataset.status || 'Detalhes';

  const avatar =
    card.dataset.avatar ||
    name.slice(0, 2).toUpperCase();

  document.getElementById(
    'current-patient-name'
  ).textContent = name;

  document.getElementById(
    'current-patient-avatar'
  ).textContent = avatar;

  document.getElementById(
    'current-patient-meta'
  ).innerHTML = `
    Convênio: ${convenio}
    • ${age} anos
    • <strong class="text-danger">${status}</strong>
  `;

  const chatHistory =
    document.getElementById('chatHistory');

  if (chatHistory) {
    chatHistory.innerHTML = `
      <div class="message system-msg">
        Atendimento de ${specialty} com ${convenio} iniciado.
      </div>

      <div class="message patient-msg">
        <p>
          Olá, estou com a consulta de ${specialty}.
          Preciso confirmar meus documentos e a fila de atendimento.
        </p>

        <span class="time">
          Hoje · Paciente
        </span>
      </div>

      <div class="message atendente-msg">
        <p>
          Olá ${name.split(' ')[0]},
          estamos revisando sua documentação e envio
          de exames para a sua consulta.
        </p>

        <span class="time">
          Agora · Atendente
        </span>
      </div>
    `;
  }

  const statusText =
    status.toLowerCase().includes('vencida') ||
    status.toLowerCase().includes('pendente')
      ? 'CARTEIRINHA EXPIRADA (01/07/2026)'
      : 'CARTEIRINHA VALIDADA';

  updateCopilotInsights(
    name,
    specialty,
    convenio,
    statusText,
    '14/09/2026'
  );
}

function sendAtendenteMessage() {
  const input =
    document.getElementById('chat-input');

  const chatHistory =
    document.getElementById('chatHistory');

  const attachmentInput =
    document.getElementById('attachmentInput');

  const preview =
    document.getElementById('attachmentPreview');

  if (
    !input ||
    !chatHistory ||
    (
      !input.value.trim() &&
      !attachmentInput?.files?.length
    )
  ) {
    return;
  }

  const messageText =
    input.value.trim();

  const attachmentName =
    attachmentInput &&
    attachmentInput.files &&
    attachmentInput.files[0]
      ? attachmentInput.files[0].name
      : null;

  const msg =
    document.createElement('div');

  msg.className =
    'message atendente-msg';

  let html =
    `<p>${messageText || 'Arquivo anexado para o paciente.'}</p>`;

  if (attachmentName) {
    html += `
      <p>
        <strong>Anexo:</strong>
        ${attachmentName}
      </p>
    `;
  }

  html += `
    <span class="time">
      Agora · Atendente
    </span>
  `;

  msg.innerHTML = html;

  chatHistory.appendChild(msg);

  input.value = '';

  if (preview) {
    preview.innerHTML = '';
  }

  if (attachmentInput) {
    attachmentInput.value = '';
  }

  chatHistory.scrollTop =
    chatHistory.scrollHeight;

  if (attachmentName) {
    const list =
      document.getElementById('documentsList');

    if (list) {
      const item =
        document.createElement('div');

      item.className =
        'doc-item';

      item.innerHTML = `
        <i data-lucide="file-text" size="18"></i>

        <div class="doc-info">
          <strong>${attachmentName}</strong>

          <span>
            Receita · Enviado agora ·
            ${Math.max(
              1,
              Math.round(
                (attachmentInput.files[0].size || 1000) / 1024
              )
            )} KB
          </span>
        </div>

        <button class="btn-icon" title="Reenviar">
          <i data-lucide="send" size="14"></i>
        </button>
      `;

      list.prepend(item);

      lucide.createIcons();
    }
  }

  showToast(
    'Mensagem enviada ao paciente com sucesso!',
    'success'
  );
}

function simulateUploadPdf() {
  const input =
    document.getElementById('pdfUploadInput');

  if (!input) return;

  input.click();

  input.onchange = (event) => {
    const file =
      event.target.files &&
      event.target.files[0];

    if (!file) return;

    const documentType =
      document.getElementById('document-type')?.value ||
      'Exame';

    const list =
      document.getElementById('documentsList');

    if (!list) return;

    const item =
      document.createElement('div');

    item.className =
      'doc-item';

    item.innerHTML = `
      <i data-lucide="file-text" size="18"></i>

      <div class="doc-info">
        <strong>${file.name}</strong>

        <span>
          ${documentType} · Enviado agora ·
          ${Math.max(
            1,
            Math.round(file.size / 1024)
          )} KB
        </span>
      </div>

      <button class="btn-icon" title="Reenviar">
        <i data-lucide="send" size="14"></i>
      </button>
    `;

    list.prepend(item);

    lucide.createIcons();

    showToast(
      `PDF de ${documentType.toLowerCase()} enviado para o paciente!`,
      'success'
    );

    input.value = '';
  };
}

function selectPaymentMethod(element, value) {
  document
    .querySelectorAll('.payment-card')
    .forEach(card => card.classList.remove('selected'));

  element.classList.add('selected');

  document.getElementById(
    'agenda-metodo-particular'
  ).value = value;
}

function salvarEdicaoDados(e) {
  e.preventDefault();

  const nome =
    document.getElementById('edit-nome').value;

  const tel =
    document.getElementById('edit-telefone').value;

  const cep =
    document.getElementById('edit-cep').value;

  const rua =
    document.getElementById('edit-rua').value;

  const num =
    document.getElementById('edit-numero').value;

  const comp =
    document.getElementById('edit-complemento').value;

  const operadora =
    document.getElementById('edit-operadora').value;

  const plano =
    document.getElementById('edit-plano').value;

  const cart =
    document.getElementById('edit-carteirinha').value;

  const val =
    document.getElementById('edit-validade').value;

  document.getElementById(
    'view-nome'
  ).innerText = nome;

  document.getElementById(
    'view-telefone'
  ).innerText = tel;

  document.getElementById(
    'view-cep'
  ).innerText = cep;

  document.getElementById(
    'view-rua'
  ).innerText = rua;

  document.getElementById(
    'view-numero'
  ).innerText = num;

  document.getElementById(
    'view-complemento'
  ).innerText = comp;

  document.getElementById(
    'view-operadora'
  ).innerText = operadora;

  document.getElementById(
    'view-plano'
  ).innerText = plano;

  document.getElementById(
    'view-carteirinha'
  ).innerText = cart;

  if (val) {
    const partes =
      val.split('-');

    if (partes.length === 3) {
      const dataFormatada =
        `${partes[2]}/${partes[1]}/${partes[0]}`;

      const elVal =
        document.getElementById('view-validade');

      elVal.innerText =
        dataFormatada;

      elVal.classList.remove(
        'text-danger'
      );
    }
  }

  document.getElementById(
    'modal-alert-divergencia'
  ).style.display = 'none';

  document.getElementById(
    'group-validade'
  ).classList.remove('field-error');

  document.getElementById(
    'edit-validade'
  ).classList.remove('input-danger');

  const badgeCart =
    document.getElementById(
      'badge-carteirinha'
    );

  badgeCart.className =
    'badge badge-success';

  badgeCart.innerText =
    'Carteirinha Validada';

  const heroTitle =
    document.getElementById(
      'hero-status-title'
    );

  heroTitle.innerText =
    'Cadastro 100% Pronto para Atendimento';

  const gauge =
    document.getElementById(
      'readiness-gauge'
    );

  gauge.className =
    'readiness-gauge green';

  document.getElementById(
    'gauge-score'
  ).innerText = '100%';

  const checkConv =
    document.getElementById(
      'check-convenio-item'
    );

  checkConv.className =
    'check-item verified';

  checkConv.innerHTML = `
    <i data-lucide="check-circle-2" size="16"></i>
    Convênio & Carteirinha
  `;

  document.getElementById(
    'dash-status-sub'
  ).innerText =
    'Todos os dados e validações do convênio foram efetuados com sucesso.';

  document.getElementById(
    'btnRevisarDados'
  ).style.display = 'none';

  const aiAlert =
    document.getElementById(
      'ai-alert-convenio'
    );

  if (aiAlert) {
    aiAlert.className =
      'ai-check-row success';

    aiAlert.innerHTML = `
      <i data-lucide="check" size="16"></i>
      Convênio Bradesco: CARTEIRINHA VALIDADA
    `;

    document.getElementById(
      'ai-recommendation-text'
    ).innerText =
      'Paciente 100% apto. Nenhuma ação necessária na recepção.';
  }

  lucide.createIcons();

  closeModal(
    'modalEditarDados'
  );

  showToast(
    'Cadastro validado e atualizado com sucesso!',
    'success'
  );
}

function salvarNovoAgendamento(e) {
  e.preventDefault();

  const esp =
    document.getElementById(
      'agenda-especialidade'
    ).value;

  const med =
    document.getElementById(
      'agenda-medico'
    ).value;

  const dataRaw =
    document.getElementById(
      'agenda-data'
    ).value;

  const hora =
    document.getElementById(
      'agenda-hora'
    ).value;

  const tipoPag =
    document.getElementById(
      'agenda-tipo-pagamento'
    ).value;

  let formaFinal =
    tipoPag;

  if (tipoPag === 'Particular') {
    formaFinal =
      document.getElementById(
        'agenda-metodo-particular'
      ).value;
  }

  let dataFmt =
    dataRaw;

  if (dataRaw) {
    const p =
      dataRaw.split('-');

    if (p.length === 3) {
      dataFmt =
        `${p[2]}/${p[1]}/${p[0]}`;
    }
  }

  document.getElementById(
    'dash-especialidade'
  ).innerText = esp;

  document.getElementById(
    'dash-medico'
  ).innerText =
    `${med} · Unidade Central`;

  document.getElementById(
    'dash-data'
  ).innerText = dataFmt;

  document.getElementById(
    'dash-hora'
  ).innerText = hora;

  document.getElementById(
    'dash-pagamento'
  ).innerText = formaFinal;

  lucide.createIcons();

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

function logout() {
  document.getElementById(
    'appHeader'
  ).style.display = 'none';

  navigate('login');
}