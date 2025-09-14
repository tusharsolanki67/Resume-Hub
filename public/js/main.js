// Main JavaScript for ResumeHub

// Toast notifications
function showToast(message, type = 'info') {
    const existingToasts = document.querySelectorAll('.toast-notification');
    existingToasts.forEach(toast => toast.remove());
    
    if (window.toastTimeout) clearTimeout(window.toastTimeout);
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `position: fixed; top: 20px; right: 20px; padding: 18px 24px; border-radius: 16px; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; font-weight: 500; z-index: 10000; min-width: 340px; backdrop-filter: blur(12px); box-shadow: 0 10px 40px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04); transform: translateX(450px); transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); display: flex; align-items: center; gap: 14px; border: 1px solid rgba(255,255,255,0.15);`;
    
    const colors = {
        success: 'blue',
        error: 'red',
        info: 'green'
    };
    
    const icons = { success: '✓', error: '✕', info: 'i' };
    
    toast.style.background = colors[type] || colors.info;
    toast.innerHTML = `<div style="width: 28px; height: 28px; background: rgba(255,255,255,0.25); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 600;">${icons[type] || icons.info}</div><span style="flex: 1; line-height: 1.4;">${message}</span>`;
    
    document.body.appendChild(toast);
    setTimeout(() => toast.style.transform = 'translateX(0)', 100);
    
    window.toastTimeout = setTimeout(() => {
        toast.style.transform = 'translateX(450px)';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// Global variables
let editingId = null;
let isSubmitting = false;

// CRUD functions
function submitForm(formId, apiUrl) {
    if (isSubmitting) return;
    isSubmitting = true;
    
    const form = document.getElementById(formId);
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    
    btn.disabled = true;
    btn.textContent = 'Saving...';
    
    const data = Object.fromEntries(new FormData(form));
    const url = editingId ? `${apiUrl}/${editingId}` : apiUrl;
    const method = editingId ? 'PUT' : 'POST';
    
    fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            showToast(editingId ? 'Updated!' : 'Saved!', 'success');
            setTimeout(() => location.reload(), 1500);
        } else {
            showToast('Error: ' + (result.error || 'Failed'), 'error');
        }
    })
    .catch(() => showToast('Network error', 'error'))
    .finally(() => {
        btn.disabled = false;
        btn.textContent = originalText;
        isSubmitting = false;
        editingId = null;
    });
}

function deleteItem(id, type) {
    if (confirm('Are you sure you want to delete this item?')) {
        fetch(`/api/${type}/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                showToast('Deleted!', 'success');
                setTimeout(() => location.reload(), 1500);
            } else {
                showToast('Error: ' + (result.error || 'Failed'), 'error');
            }
        })
        .catch(() => showToast('Network error', 'error'));
    }
}

// Edit functions
function editSkill(id, element) {
    editingId = id;
    document.getElementById('skillName').value = element.dataset.name || '';
    document.getElementById('skillCategory').value = element.dataset.category || '';
    document.getElementById('skillProficiency').value = element.dataset.proficiency || '';
    document.querySelector('#skillModal .modal-title').textContent = 'Edit Skill';
    document.querySelector('#skillForm button[type="submit"]').textContent = 'Update Skill';
    new bootstrap.Modal(document.getElementById('skillModal')).show();
}

function editProject(id, element) {
    editingId = id;
    document.getElementById('projectTitle').value = element.dataset.title || '';
    document.getElementById('projectDescription').value = element.dataset.description || '';
    document.getElementById('projectTechnologies').value = element.dataset.technologies || '';
    document.getElementById('projectGithub').value = element.dataset.github || '';
    document.getElementById('projectLive').value = element.dataset.live || '';
    document.querySelector('#projectModal .modal-title').textContent = 'Edit Project';
    document.querySelector('#projectForm button[type="submit"]').textContent = 'Update Project';
    new bootstrap.Modal(document.getElementById('projectModal')).show();
}

function editEducation(id, element) {
    editingId = id;
    document.getElementById('eduInstitution').value = element.dataset.institution || '';
    document.getElementById('eduDegree').value = element.dataset.degree || '';
    document.getElementById('eduField').value = element.dataset.field || '';
    document.getElementById('eduStartYear').value = element.dataset.startYear || '';
    document.getElementById('eduEndYear').value = element.dataset.endYear || '';
    document.getElementById('eduGrade').value = element.dataset.grade || '';
    document.getElementById('eduDescription').value = element.dataset.description || '';
    document.querySelector('#educationModal .modal-title').textContent = 'Edit Education';
    document.querySelector('#educationForm button[type="submit"]').textContent = 'Update Education';
    new bootstrap.Modal(document.getElementById('educationModal')).show();
}

function editExperience(id, element) {
    editingId = id;
    document.getElementById('expCompany').value = element.dataset.company || '';
    document.getElementById('expPosition').value = element.dataset.position || '';
    document.getElementById('expLocation').value = element.dataset.location || '';
    document.getElementById('expStartDate').value = element.dataset.startDate || '';
    document.getElementById('expEndDate').value = element.dataset.endDate || '';
    document.getElementById('expCurrent').checked = element.dataset.current === 'true';
    document.getElementById('expDescription').value = element.dataset.description || '';
    document.getElementById('expResponsibilities').value = element.dataset.responsibilities || '';
    
    if (document.getElementById('expCurrent').checked) {
        document.getElementById('expEndDate').disabled = true;
    }
    
    document.querySelector('#experienceModal .modal-title').textContent = 'Edit Experience';
    document.querySelector('#experienceForm button[type="submit"]').textContent = 'Update Experience';
    new bootstrap.Modal(document.getElementById('experienceModal')).show();
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Dropdown menu
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userMenu = document.getElementById('userMenu');
    
    if (userMenuBtn && userMenu) {
        userMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userMenu.style.display = userMenu.style.display === 'none' ? 'block' : 'none';
        });
        
        document.addEventListener('click', function(event) {
            if (!userMenuBtn.contains(event.target) && !userMenu.contains(event.target)) {
                userMenu.style.display = 'none';
            }
        });
    }
    
    // Form submissions
    const forms = [
        { id: 'skillForm', api: '/api/skills' },
        { id: 'projectForm', api: '/api/projects' },
        { id: 'educationForm', api: '/api/education' },
        { id: 'experienceForm', api: '/api/experience' }
    ];
    
    forms.forEach(({ id, api }) => {
        const form = document.getElementById(id);
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                submitForm(id, api);
            });
        }
    });
    
    // Reset editingId when opening add modals
    document.querySelectorAll('[data-bs-toggle="modal"]').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.onclick) {
                editingId = null;
                const modalId = this.getAttribute('data-bs-target').replace('#', '');
                const form = document.querySelector(`#${modalId} form`);
                if (form) form.reset();
                
                // Reset modal titles
                const titles = {
                    'skillModal': ['Add New Skill', 'Add Skill'],
                    'projectModal': ['Add New Project', 'Add Project'],
                    'educationModal': ['Add New Education', 'Add Education'],
                    'experienceModal': ['Add New Experience', 'Add Experience']
                };
                
                if (titles[modalId]) {
                    const titleEl = document.querySelector(`#${modalId} .modal-title`);
                    const btnEl = document.querySelector(`#${modalId} button[type="submit"]`);
                    if (titleEl) titleEl.textContent = titles[modalId][0];
                    if (btnEl) btnEl.textContent = titles[modalId][1];
                }
            }
        });
    });
});