/**
 * Authentication Form with Password Strength Indicator
 * Integrates with the Chaos World backend authentication system
 */

import { PasswordStrengthIndicator, PasswordCheck } from './password-strength.js';

export class AuthForm {
  private form: HTMLFormElement;
  private passwordInput: HTMLInputElement;
  private confirmPasswordInput: HTMLInputElement;
  private strengthIndicator: PasswordStrengthIndicator | null = null;
  private strengthContainer: HTMLElement | null = null;

  constructor(formId: string) {
    this.form = document.getElementById(formId) as HTMLFormElement;
    if (!this.form) {
      throw new Error(`Form with id "${formId}" not found`);
    }

    this.passwordInput = this.form.querySelector('input[type="password"][name="password"]') as HTMLInputElement;
    this.confirmPasswordInput = this.form.querySelector('input[type="password"][name="confirmPassword"]') as HTMLInputElement;
    
    if (!this.passwordInput) {
      throw new Error('Password input not found in form');
    }

    this.init();
  }

  private init(): void {
    // Create password strength container if it doesn't exist
    this.createStrengthContainer();
    
    // Initialize password strength indicator
    if (this.strengthContainer) {
      this.strengthIndicator = new PasswordStrengthIndicator(
        this.passwordInput, 
        this.strengthContainer
      );
    }

    // Add event listeners
    this.setupEventListeners();
  }

  private createStrengthContainer(): void {
    // Look for existing container
    this.strengthContainer = this.form.querySelector('#password-strength-container');
    
    if (!this.strengthContainer) {
      // Create container
      this.strengthContainer = document.createElement('div');
      this.strengthContainer.id = 'password-strength-container';
      this.strengthContainer.className = 'password-strength-indicator hidden';
      
      // Insert after password input
      this.passwordInput.parentNode?.insertBefore(
        this.strengthContainer, 
        this.passwordInput.nextSibling
      );
    }
  }

  private setupEventListeners(): void {
    // Show/hide strength indicator
    this.passwordInput.addEventListener('focus', () => {
      this.strengthContainer?.classList.remove('hidden');
    });

    this.passwordInput.addEventListener('blur', () => {
      if (!this.passwordInput.value) {
        this.strengthContainer?.classList.add('hidden');
      }
    });

    // Real-time password confirmation validation
    if (this.confirmPasswordInput) {
      this.confirmPasswordInput.addEventListener('input', () => {
        this.validatePasswordConfirmation();
      });
    }

    // Form submission validation
    this.form.addEventListener('submit', (e) => {
      if (!this.validateForm()) {
        e.preventDefault();
      }
    });
  }

  private validatePasswordConfirmation(): void {
    if (!this.confirmPasswordInput) return;

    const password = this.passwordInput.value;
    const confirmPassword = this.confirmPasswordInput.value;

    if (confirmPassword && password !== confirmPassword) {
      this.confirmPasswordInput.style.borderColor = '#ff4444';
      this.showFieldError(this.confirmPasswordInput, 'Passwords do not match');
    } else {
      this.confirmPasswordInput.style.borderColor = '';
      this.clearFieldError(this.confirmPasswordInput);
    }
  }

  private validateForm(): boolean {
    let isValid = true;

    // Validate password strength
    if (this.strengthIndicator) {
      const passwordValidation = this.strengthIndicator.getValidationResult();
      if (!passwordValidation.isValid) {
        this.showFormError('Password does not meet requirements:\n' + passwordValidation.errors.join('\n'));
        isValid = false;
      }
    }

    // Validate password confirmation
    if (this.confirmPasswordInput) {
      const password = this.passwordInput.value;
      const confirmPassword = this.confirmPasswordInput.value;
      
      if (password !== confirmPassword) {
        this.showFormError('Passwords do not match');
        isValid = false;
      }
    }

    // Validate required fields
    const requiredFields = this.form.querySelectorAll('input[required]');
    requiredFields.forEach((field) => {
      const input = field as HTMLInputElement;
      if (!input.value.trim()) {
        this.showFieldError(input, 'This field is required');
        isValid = false;
      } else {
        this.clearFieldError(input);
      }
    });

    return isValid;
  }

  private showFieldError(input: HTMLInputElement, message: string): void {
    // Remove existing error
    this.clearFieldError(input);
    
    // Add error styling
    input.style.borderColor = '#ff4444';
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#ff4444';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '4px';
    errorDiv.textContent = message;
    
    // Insert after input
    input.parentNode?.insertBefore(errorDiv, input.nextSibling);
  }

  private clearFieldError(input: HTMLInputElement): void {
    input.style.borderColor = '';
    
    const errorDiv = input.parentNode?.querySelector('.field-error');
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  private showFormError(message: string): void {
    // Remove existing form error
    this.clearFormError();
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.style.color = '#ff4444';
    errorDiv.style.backgroundColor = '#ffe6e6';
    errorDiv.style.border = '1px solid #ff4444';
    errorDiv.style.borderRadius = '4px';
    errorDiv.style.padding = '12px';
    errorDiv.style.marginBottom = '16px';
    errorDiv.style.fontSize = '14px';
    errorDiv.style.whiteSpace = 'pre-line';
    errorDiv.textContent = message;
    
    // Insert at top of form
    this.form.insertBefore(errorDiv, this.form.firstChild);
  }

  private clearFormError(): void {
    const errorDiv = this.form.querySelector('.form-error');
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  /**
   * Get form data as JSON object
   */
  getFormData(): Record<string, any> {
    const formData = new FormData(this.form);
    const data: Record<string, any> = {};
    
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    return data;
  }

  /**
   * Get password validation result
   */
  getPasswordValidation(): PasswordCheck | null {
    return this.strengthIndicator?.getValidationResult() || null;
  }

  /**
   * Reset form
   */
  reset(): void {
    this.form.reset();
    this.clearFormError();
    
    // Clear all field errors
    const inputs = this.form.querySelectorAll('input');
    inputs.forEach(input => this.clearFieldError(input as HTMLInputElement));
    
    // Hide strength indicator
    this.strengthContainer?.classList.add('hidden');
  }
}

// Auto-initialize auth forms
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize registration form
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
      try {
        new AuthForm('registration-form');
        console.log('Registration form initialized with password strength indicator');
      } catch (error) {
        console.warn('Could not initialize registration form:', error);
      }
    }

    // Initialize login form (no password strength needed)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      // Add basic validation for login form
      loginForm.addEventListener('submit', (e) => {
        const form = e.target as HTMLFormElement;
        const username = form.querySelector('input[name="username"]') as HTMLInputElement;
        const password = form.querySelector('input[name="password"]') as HTMLInputElement;
        
        if (!username.value.trim() || !password.value.trim()) {
          e.preventDefault();
          alert('Please fill in all required fields');
        }
      });
    }
  });
}
