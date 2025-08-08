// MC6 - Enhanced Form Validation and UX
// Validação em tempo real com feedback visual

class FormValidator {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    this.fields = {};
    this.init();
  }

  init() {
    if (!this.form) return;
    
    this.setupFields();
    this.addEventListeners();
    this.injectStyles();
  }

  setupFields() {
    const inputs = this.form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      const fieldName = input.name || input.id;
      this.fields[fieldName] = {
        element: input,
        isValid: false,
        rules: this.getValidationRules(input),
        errorElement: this.createErrorElement(input)
      };
    });
  }

  getValidationRules(input) {
    const rules = [];
    
    if (input.required) {
      rules.push({ type: 'required', message: 'Este campo é obrigatório' });
    }
    
    if (input.type === 'email') {
      rules.push({ 
        type: 'email', 
        message: 'Digite um email válido',
        regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      });
    }
    
    if (input.type === 'tel' || input.name === 'phone') {
      rules.push({ 
        type: 'phone', 
        message: 'Digite um telefone válido (XX) XXXXX-XXXX',
        regex: /^\(\d{2}\)\s\d{4,5}-\d{4}$/
      });
    }
    
    if (input.name === 'company' || input.name === 'empresa') {
      rules.push({ 
        type: 'minLength', 
        value: 2, 
        message: 'Nome da empresa deve ter pelo menos 2 caracteres' 
      });
    }
    
    return rules;
  }

  createErrorElement(input) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.setAttribute('aria-live', 'polite');
    
    input.parentNode.insertBefore(errorDiv, input.nextSibling);
    return errorDiv;
  }

  addEventListeners() {
    Object.values(this.fields).forEach(field => {
      // Validação em tempo real (com debounce)
      field.element.addEventListener('input', this.debounce((e) => {
        this.validateField(field);
      }, 300));
      
      // Validação ao perder o foco
      field.element.addEventListener('blur', () => {
        this.validateField(field);
      });
      
      // Formatação automática para telefone
      if (field.element.type === 'tel' || field.element.name === 'phone') {
        field.element.addEventListener('input', this.formatPhone);
      }
    });
    
    // Validação no submit
    this.form.addEventListener('submit', (e) => {
      if (!this.validateForm()) {
        e.preventDefault();
        this.focusFirstError();
      } else {
        this.showSubmissionFeedback();
      }
    });
  }

  validateField(field) {
    const value = field.element.value.trim();
    let isValid = true;
    let errorMessage = '';

    for (const rule of field.rules) {
      if (rule.type === 'required' && !value) {
        isValid = false;
        errorMessage = rule.message;
        break;
      }
      
      if (value && rule.regex && !rule.regex.test(value)) {
        isValid = false;
        errorMessage = rule.message;
        break;
      }
      
      if (value && rule.type === 'minLength' && value.length < rule.value) {
        isValid = false;
        errorMessage = rule.message;
        break;
      }
    }

    this.updateFieldStatus(field, isValid, errorMessage);
    field.isValid = isValid;
    
    return isValid;
  }

  updateFieldStatus(field, isValid, message) {
    const input = field.element;
    const errorElement = field.errorElement;
    
    // Remove classes anteriores
    input.classList.remove('error', 'success');
    
    if (message) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
      input.classList.add('error');
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', errorElement.id || '');
    } else if (input.value.trim()) {
      errorElement.style.display = 'none';
      input.classList.add('success');
      input.setAttribute('aria-invalid', 'false');
    } else {
      errorElement.style.display = 'none';
      input.removeAttribute('aria-invalid');
    }
  }

  validateForm() {
    let formIsValid = true;
    
    Object.values(this.fields).forEach(field => {
      if (!this.validateField(field)) {
        formIsValid = false;
      }
    });
    
    return formIsValid;
  }

  focusFirstError() {
    const firstErrorField = Object.values(this.fields)
      .find(field => !field.isValid);
    
    if (firstErrorField) {
      firstErrorField.element.focus();
      firstErrorField.element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }

  showSubmissionFeedback() {
    const submitButton = this.form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    submitButton.classList.add('loading');
    
    // Simular envio (remover quando implementar backend)
    setTimeout(() => {
      submitButton.textContent = '✓ Enviado!';
      submitButton.classList.remove('loading');
      submitButton.classList.add('success');
      
      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        submitButton.classList.remove('success');
      }, 3000);
    }, 2000);
  }

  formatPhone(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      if (value.length <= 2) {
        value = value.replace(/(\d{0,2})/, '($1');
      } else if (value.length <= 7) {
        value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
      } else {
        value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      }
    }
    
    e.target.value = value;
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  injectStyles() {
    if (document.getElementById('form-validator-styles')) return;
    
    const styles = `
      <style id="form-validator-styles">
        .field-error {
          display: none;
          color: #e74c3c;
          font-size: 0.875rem;
          margin-top: 0.25rem;
          font-weight: 500;
        }
        
        .form-field input.error,
        .form-field textarea.error {
          border-color: #e74c3c !important;
          box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.1) !important;
        }
        
        .form-field input.success,
        .form-field textarea.success {
          border-color: #27ae60 !important;
          box-shadow: 0 0 0 2px rgba(39, 174, 96, 0.1) !important;
        }
        
        button[type="submit"].loading {
          position: relative;
          color: transparent !important;
        }
        
        button[type="submit"].loading::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 16px;
          height: 16px;
          margin: -8px 0 0 -8px;
          border: 2px solid transparent;
          border-top: 2px solid #fff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        button[type="submit"].success {
          background-color: #27ae60 !important;
          border-color: #27ae60 !important;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Melhor feedback visual para touch */
        @media (pointer: coarse) {
          .form-field input,
          .form-field textarea,
          .form-field select {
            min-height: 48px;
            padding: 12px 16px;
            font-size: 16px; /* Previne zoom no iOS */
          }
          
          button[type="submit"] {
            min-height: 48px;
            padding: 12px 24px;
            font-size: 16px;
          }
        }
      </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
  }
}

// Lead Scoring System
class LeadScoring {
  constructor() {
    this.scores = {
      hasCompany: 20,
      urgencyImmediate: 30,
      urgencyWeek: 20,
      budgetHigh: 40,
      budgetMedium: 25,
      localClient: 15,
      completedAllFields: 10
    };
  }

  calculateScore(formData) {
    let score = 0;
    
    // Tem empresa
    if (formData.company || formData.empresa) {
      score += this.scores.hasCompany;
    }
    
    // Urgência
    if (formData.urgency === 'immediate' || formData.urgencia === 'imediato') {
      score += this.scores.urgencyImmediate;
    } else if (formData.urgency === 'week' || formData.urgencia === 'semana') {
      score += this.scores.urgencyWeek;
    }
    
    // Orçamento estimado
    const budget = parseInt(formData.budget || formData.orcamento || 0);
    if (budget > 10000) {
      score += this.scores.budgetHigh;
    } else if (budget > 5000) {
      score += this.scores.budgetMedium;
    }
    
    // Cliente local (Blumenau/SC)
    const city = (formData.city || formData.cidade || '').toLowerCase();
    if (city.includes('blumenau') || city.includes('sc') || city.includes('santa catarina')) {
      score += this.scores.localClient;
    }
    
    // Completou todos os campos
    const requiredFields = ['name', 'email', 'phone', 'message'];
    const completedFields = requiredFields.filter(field => 
      formData[field] && formData[field].trim()
    );
    
    if (completedFields.length === requiredFields.length) {
      score += this.scores.completedAllFields;
    }
    
    return Math.min(score, 100);
  }

  getLeadPriority(score) {
    if (score >= 80) return 'hot';
    if (score >= 50) return 'warm';
    if (score >= 25) return 'cold';
    return 'low';
  }

  trackLeadScore(formData) {
    const score = this.calculateScore(formData);
    const priority = this.getLeadPriority(score);
    
    // Send to analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'lead_scored', {
        event_category: 'lead_generation',
        event_label: priority,
        value: score,
        custom_parameters: {
          lead_score: score,
          lead_priority: priority,
          company: formData.company || 'individual',
          service_interest: 'wifi_corporativo'
        }
      });
    }
    
    return { score, priority };
  }
}

// Initialize quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar validação de formulários
  const validator = new FormValidator('#contact-form, .contact-form, form[name="contact"]');
  
  // Inicializar lead scoring
  const leadScoring = new LeadScoring();
  
  // Interceptar envio de formulários para scoring
  document.addEventListener('submit', (e) => {
    const form = e.target;
    if (form.matches('#contact-form, .contact-form, form[name="contact"]')) {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      
      const scoring = leadScoring.trackLeadScore(data);
      
      // Debug mode (remover em produção)
      if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
        console.log('Lead Score:', scoring);
      }
      
      // Adicionar score ao form data
      const scoreInput = document.createElement('input');
      scoreInput.type = 'hidden';
      scoreInput.name = 'lead_score';
      scoreInput.value = scoring.score;
      form.appendChild(scoreInput);
      
      const priorityInput = document.createElement('input');
      priorityInput.type = 'hidden';
      priorityInput.name = 'lead_priority';
      priorityInput.value = scoring.priority;
      form.appendChild(priorityInput);
    }
  });
});

export { FormValidator, LeadScoring };
