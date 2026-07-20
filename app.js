/**
 * Renewal KC Web Generator - Application Logic
 * Author: Antigravity AI
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // Elements Selection
  const form = document.getElementById('generator-form');
  const themeToggleBtn = document.getElementById('theme-toggle');
  const currentDateBadge = document.getElementById('current-date-badge');
  
  // Action Buttons
  const btnPrint = document.getElementById('btn-print');
  const btnSave = document.getElementById('btn-save');
  const btnReset = document.getElementById('btn-reset');
  const btnClearHistory = document.getElementById('btn-clear-history');
  
  // History Elements
  const historyGrid = document.getElementById('history-grid');
  const historyCountBadge = document.getElementById('history-count');
  
  // Toast Element
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');

  // Input Fields
  const fields = {
    docType: document.getElementById('doc-type'),
    docNumber: document.getElementById('doc-number'),
    p1Name: document.getElementById('p1-name'),
    p1Role: document.getElementById('p1-role'),
    p1Company: document.getElementById('p1-company'),
    p2Name: document.getElementById('p2-name'),
    p2Id: document.getElementById('p2-id'),
    p2Role: document.getElementById('p2-role'),
    p2Unit: document.getElementById('p2-unit'),
    duration: document.getElementById('contract-duration'),
    performanceScore: document.getElementById('performance-score'),
    startDate: document.getElementById('start-date'),
    endDate: document.getElementById('end-date'),
    compensation: document.getElementById('compensation'),
  };

  // Preview elements mappings
  const previews = {
    docTitle: document.getElementById('preview-doc-title'),
    docNumber: document.getElementById('preview-doc-number'),
    companyName: document.getElementById('preview-company-name'),
    p1Name: document.getElementById('preview-p1-name'),
    p1NameSig: document.getElementById('preview-p1-name-sig'),
    p1Role: document.getElementById('preview-p1-role'),
    p1RoleSig: document.getElementById('preview-p1-role-sig'),
    p1Company: document.getElementById('preview-p1-company'),
    p1CompanyRef: document.getElementById('preview-p1-company-ref'),
    p1CompanyRef2: document.getElementById('preview-company-ref-2'),
    p2Name: document.getElementById('preview-p2-name'),
    p2NameSig: document.getElementById('preview-p2-name-sig'),
    p2Id: document.getElementById('preview-p2-id'),
    p2Role: document.getElementById('preview-p2-role'),
    p2Unit: document.getElementById('preview-p2-unit'),
    duration: document.getElementById('preview-duration'),
    performanceScore: document.getElementById('preview-performance-score'),
    startDate: document.getElementById('preview-start-date'),
    endDate: document.getElementById('preview-end-date'),
    compensation: document.getElementById('preview-compensation'),
    dateCreated: document.getElementById('preview-date-created'),
  };

  // Indonesian Months
  const indonesianMonths = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Helper: Format Date to Indonesian Standard (DD Month YYYY)
  function formatDateIndonesian(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = date.getDate();
    const month = indonesianMonths[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  // Helper: Format Current Date for Badge (DD/MM/YYYY)
  function formatCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Toast Notification System
  function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    
    // Set icon & border color based on type
    if (type === 'success') {
      toast.style.borderColor = 'var(--border-focus)';
      toastIcon.setAttribute('data-lucide', 'check-circle');
      toastIcon.style.color = '#10b981';
    } else if (type === 'error') {
      toast.style.borderColor = '#ef4444';
      toastIcon.setAttribute('data-lucide', 'alert-circle');
      toastIcon.style.color = '#ef4444';
    } else {
      toast.style.borderColor = 'var(--border)';
      toastIcon.setAttribute('data-lucide', 'info');
      toastIcon.style.color = 'var(--accent)';
    }
    
    lucide.createIcons();
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // Update Preview Panel from Form Fields
  function updatePreview() {
    previews.docTitle.textContent = fields.docType.value.toUpperCase();
    previews.docNumber.textContent = fields.docNumber.value || '-';
    previews.companyName.textContent = (fields.p1Company.value || 'PT TELKOM INDONESIA (PERSERO) TBK').toUpperCase();
    
    previews.p1Name.textContent = fields.p1Name.value || '-';
    previews.p1NameSig.textContent = fields.p1Name.value || '-';
    
    previews.p1Role.textContent = fields.p1Role.value || '-';
    previews.p1RoleSig.textContent = fields.p1Role.value || '-';
    
    previews.p1Company.textContent = fields.p1Company.value || '-';
    previews.p1CompanyRef.textContent = fields.p1Company.value || '-';
    previews.p1CompanyRef2.textContent = fields.p1Company.value || '-';
    
    previews.p2Name.textContent = fields.p2Name.value || '-';
    previews.p2NameSig.textContent = fields.p2Name.value || '-';
    previews.p2Id.textContent = fields.p2Id.value || '-';
    previews.p2Role.textContent = fields.p2Role.value || '-';
    previews.p2Unit.textContent = fields.p2Unit.value || '-';
    
    previews.duration.textContent = fields.duration.value;
    previews.performanceScore.textContent = fields.performanceScore.value || '0';
    
    previews.startDate.textContent = formatDateIndonesian(fields.startDate.value);
    previews.endDate.textContent = formatDateIndonesian(fields.endDate.value);
    previews.compensation.textContent = fields.compensation.value || '0';
    
    // Document signature date matches current day
    const today = new Date();
    previews.dateCreated.textContent = formatDateIndonesian(today.toISOString().split('T')[0]);
  }

  // Setup form change listener for live preview sync
  Object.values(fields).forEach(inputElement => {
    if (inputElement) {
      inputElement.addEventListener('input', updatePreview);
      inputElement.addEventListener('change', updatePreview);
    }
  });

  // THEME MANAGEMENT (Light / Dark Mode)
  function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    }
  }

  themeToggleBtn.addEventListener('click', () => {
    if (document.body.classList.contains('dark-theme')) {
      document.body.classList.replace('dark-theme', 'light-theme');
      localStorage.setItem('theme', 'light');
      showToast('Tema diubah ke Mode Terang', 'info');
    } else {
      document.body.classList.replace('light-theme', 'dark-theme');
      localStorage.setItem('theme', 'dark');
      showToast('Tema diubah ke Mode Gelap', 'info');
    }
  });

  // HISTORY LOGGER (LocalStorage)
  function getHistory() {
    const historyData = localStorage.getItem('renewal_history');
    return historyData ? JSON.parse(historyData) : [];
  }

  function saveHistory(data) {
    localStorage.setItem('renewal_history', JSON.stringify(data));
  }

  function renderHistory() {
    const history = getHistory();
    historyCountBadge.textContent = history.length;
    
    if (history.length === 0) {
      historyGrid.innerHTML = `
        <div class="history-empty">
          <i data-lucide="folder-open"></i>
          <p>Belum ada riwayat dokumen yang disimpan.</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    historyGrid.innerHTML = '';
    
    // Show newest first
    history.slice().reverse().forEach((item, index) => {
      // Find actual index in original array
      const originalIndex = history.length - 1 - index;
      
      const card = document.createElement('div');
      card.className = 'history-card';
      card.innerHTML = `
        <div class="history-card-header">
          <span class="history-card-title">${item.docType}</span>
          <span class="history-card-meta">${item.timestamp}</span>
        </div>
        <div class="history-card-body">
          <p><strong>Pihak 2:</strong> ${item.p2Name} (${item.p2Id})</p>
          <p><strong>Posisi:</strong> ${item.p2Role} - ${item.p2Unit}</p>
          <p><strong>Nomor:</strong> ${item.docNumber}</p>
        </div>
        <div class="history-card-actions">
          <button class="btn btn-secondary btn-sm btn-load" data-index="${originalIndex}" title="Muat Data Ke Form">
            <i data-lucide="folder-input"></i> Muat
          </button>
          <button class="btn btn-danger-ghost btn-sm btn-delete" data-index="${originalIndex}" title="Hapus Riwayat">
            <i data-lucide="trash"></i> Hapus
          </button>
        </div>
      `;
      historyGrid.appendChild(card);
    });

    lucide.createIcons();

    // Attach listeners to dynamically created load/delete buttons
    document.querySelectorAll('.btn-load').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = e.currentTarget.getAttribute('data-index');
        loadHistoryItem(idx);
      });
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = e.currentTarget.getAttribute('data-index');
        deleteHistoryItem(idx);
      });
    });
  }

  function loadHistoryItem(index) {
    const history = getHistory();
    const item = history[index];
    if (!item) return;

    // Load data to form fields
    fields.docType.value = item.docType;
    fields.docNumber.value = item.docNumber;
    fields.p1Name.value = item.p1Name;
    fields.p1Role.value = item.p1Role;
    fields.p1Company.value = item.p1Company;
    fields.p2Name.value = item.p2Name;
    fields.p2Id.value = item.p2Id;
    fields.p2Role.value = item.p2Role;
    fields.p2Unit.value = item.p2Unit;
    fields.duration.value = item.duration;
    fields.performanceScore.value = item.performanceScore;
    fields.startDate.value = item.startDate;
    fields.endDate.value = item.endDate;
    fields.compensation.value = item.compensation;

    updatePreview();
    showToast('Data dokumen berhasil dimuat!', 'success');
  }

  function deleteHistoryItem(index) {
    const history = getHistory();
    history.splice(index, 1);
    saveHistory(history);
    renderHistory();
    showToast('Riwayat berhasil dihapus.', 'info');
  }

  // Trigger Save Action
  btnSave.addEventListener('click', () => {
    // Basic validation
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const timestamp = new Date().toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const docData = {
      timestamp: timestamp,
      docType: fields.docType.value,
      docNumber: fields.docNumber.value,
      p1Name: fields.p1Name.value,
      p1Role: fields.p1Role.value,
      p1Company: fields.p1Company.value,
      p2Name: fields.p2Name.value,
      p2Id: fields.p2Id.value,
      p2Role: fields.p2Role.value,
      p2Unit: fields.p2Unit.value,
      duration: fields.duration.value,
      performanceScore: fields.performanceScore.value,
      startDate: fields.startDate.value,
      endDate: fields.endDate.value,
      compensation: fields.compensation.value
    };

    const history = getHistory();
    history.push(docData);
    saveHistory(history);
    renderHistory();
    showToast('Dokumen berhasil disimpan ke Riwayat!', 'success');
  });

  // Trigger Clear All Action
  btnClearHistory.addEventListener('click', () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua riwayat dokumen?')) {
      saveHistory([]);
      renderHistory();
      showToast('Semua riwayat berhasil dibersihkan.', 'info');
    }
  });

  // Reset Form
  btnReset.addEventListener('click', () => {
    if (confirm('Kosongkan semua isian form?')) {
      form.reset();
      updatePreview();
      showToast('Form berhasil di-reset.', 'info');
    }
  });

  // Print Action
  btnPrint.addEventListener('click', () => {
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    // Save current state first implicitly
    btnSave.click();
    // Open system print dialog
    window.print();
  });

  // Initializing App State
  initTheme();
  currentDateBadge.textContent = formatCurrentDate();
  
  // Set default values for dates if not pre-set
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const nextYear = new Date(nextMonth.getFullYear() + 1, nextMonth.getMonth(), 0); // End of contract period
  
  if (!fields.startDate.value) {
    fields.startDate.value = nextMonth.toISOString().split('T')[0];
  }
  if (!fields.endDate.value) {
    fields.endDate.value = nextYear.toISOString().split('T')[0];
  }

  // Load preview & history
  updatePreview();
  renderHistory();
});
