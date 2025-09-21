/**
 * Password Strength Indicator
 * Matches the backend validation logic from user-management service
 */

export interface PasswordRequirements {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecial: boolean;
}

export interface PasswordCheck {
  isValid: boolean;
  score: number; // 0-100
  errors: string[];
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    special: boolean;
  };
}

export class PasswordStrengthChecker {
  private requirements: PasswordRequirements;

  constructor(requirements?: Partial<PasswordRequirements>) {
    // Default requirements matching backend config
    this.requirements = {
      minLength: 8,
      maxLength: 128,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecial: false,
      ...requirements
    };
  }

  /**
   * Check password strength and return detailed results
   */
  checkPassword(password: string): PasswordCheck {
    const errors: string[] = [];
    const checks = {
      length: this.checkLength(password),
      uppercase: this.checkUppercase(password),
      lowercase: this.checkLowercase(password),
      numbers: this.checkNumbers(password),
      special: this.checkSpecial(password)
    };

    // Collect errors
    if (!checks.length) {
      if (password.length < this.requirements.minLength) {
        errors.push(`Password must be at least ${this.requirements.minLength} characters long`);
      } else if (password.length > this.requirements.maxLength) {
        errors.push(`Password must be no more than ${this.requirements.maxLength} characters long`);
      }
    }

    if (this.requirements.requireUppercase && !checks.uppercase) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (this.requirements.requireLowercase && !checks.lowercase) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (this.requirements.requireNumbers && !checks.numbers) {
      errors.push('Password must contain at least one number');
    }

    if (this.requirements.requireSpecial && !checks.special) {
      errors.push('Password must contain at least one special character');
    }

    // Calculate score (0-100)
    const score = this.calculateScore(password, checks);
    const isValid = errors.length === 0;

    return {
      isValid,
      score,
      errors,
      checks
    };
  }

  /**
   * Check if password meets length requirements
   */
  private checkLength(password: string): boolean {
    return password.length >= this.requirements.minLength && 
           password.length <= this.requirements.maxLength;
  }

  /**
   * Check if password contains uppercase letters
   */
  private checkUppercase(password: string): boolean {
    return /[A-Z]/.test(password);
  }

  /**
   * Check if password contains lowercase letters
   */
  private checkLowercase(password: string): boolean {
    return /[a-z]/.test(password);
  }

  /**
   * Check if password contains numbers
   */
  private checkNumbers(password: string): boolean {
    return /\d/.test(password);
  }

  /**
   * Check if password contains special characters
   */
  private checkSpecial(password: string): boolean {
    const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    return [...specialChars].some(char => password.includes(char));
  }

  /**
   * Calculate password strength score (0-100)
   */
  private calculateScore(password: string, checks: any): number {
    let score = 0;
    const maxScore = 100;

    // Length score (40 points max)
    const lengthScore = Math.min(
      (password.length / this.requirements.maxLength) * 40,
      40
    );
    score += lengthScore;

    // Character variety score (60 points max)
    let varietyScore = 0;
    if (checks.uppercase) varietyScore += 15;
    if (checks.lowercase) varietyScore += 15;
    if (checks.numbers) varietyScore += 15;
    if (checks.special) varietyScore += 15;

    score += varietyScore;

    return Math.min(Math.round(score), maxScore);
  }

  /**
   * Get strength level description
   */
  getStrengthLevel(score: number): { level: string; color: string; description: string } {
    if (score < 20) {
      return {
        level: 'Very Weak',
        color: '#ff4444',
        description: 'Password is too weak'
      };
    } else if (score < 40) {
      return {
        level: 'Weak',
        color: '#ff8800',
        description: 'Password needs improvement'
      };
    } else if (score < 60) {
      return {
        level: 'Fair',
        color: '#ffbb00',
        description: 'Password is acceptable'
      };
    } else if (score < 80) {
      return {
        level: 'Good',
        color: '#88cc00',
        description: 'Password is strong'
      };
    } else {
      return {
        level: 'Very Strong',
        color: '#00aa00',
        description: 'Password is very strong'
      };
    }
  }
}

/**
 * Create password strength indicator UI
 */
export class PasswordStrengthIndicator {
  private checker: PasswordStrengthChecker;
  private container: HTMLElement;
  private passwordInput: HTMLInputElement;

  constructor(passwordInput: HTMLInputElement, container: HTMLElement, requirements?: Partial<PasswordRequirements>) {
    this.passwordInput = passwordInput;
    this.container = container;
    this.checker = new PasswordStrengthChecker(requirements);
    
    this.init();
  }

  private init(): void {
    // Create indicator HTML
    this.container.innerHTML = `
      <div class="password-strength-indicator">
        <div class="password-strength-bar">
          <div class="password-strength-fill" style="width: 0%; background-color: #ddd;"></div>
        </div>
        <div class="password-strength-text">
          <span class="strength-level">Enter a password</span>
          <span class="strength-description"></span>
        </div>
        <div class="password-requirements">
          <div class="requirement" data-check="length">
            <span class="requirement-icon">❌</span>
            <span class="requirement-text">At least ${this.checker['requirements'].minLength} characters</span>
          </div>
          <div class="requirement" data-check="uppercase">
            <span class="requirement-icon">❌</span>
            <span class="requirement-text">One uppercase letter</span>
          </div>
          <div class="requirement" data-check="lowercase">
            <span class="requirement-icon">❌</span>
            <span class="requirement-text">One lowercase letter</span>
          </div>
          <div class="requirement" data-check="numbers">
            <span class="requirement-icon">❌</span>
            <span class="requirement-text">One number</span>
          </div>
          ${this.checker['requirements'].requireSpecial ? `
          <div class="requirement" data-check="special">
            <span class="requirement-icon">❌</span>
            <span class="requirement-text">One special character</span>
          </div>
          ` : ''}
        </div>
      </div>
    `;

    // Add event listener
    this.passwordInput.addEventListener('input', () => {
      this.updateIndicator();
    });

    // Initial update
    this.updateIndicator();
  }

  private updateIndicator(): void {
    const password = this.passwordInput.value;
    const result = this.checker.checkPassword(password);
    const strength = this.checker.getStrengthLevel(result.score);

    // Update progress bar
    const fill = this.container.querySelector('.password-strength-fill') as HTMLElement;
    const levelText = this.container.querySelector('.strength-level') as HTMLElement;
    const descText = this.container.querySelector('.strength-description') as HTMLElement;

    if (fill) {
      fill.style.width = `${result.score}%`;
      fill.style.backgroundColor = strength.color;
    }

    if (levelText) {
      levelText.textContent = password ? strength.level : 'Enter a password';
      levelText.style.color = strength.color;
    }

    if (descText) {
      descText.textContent = password ? strength.description : '';
    }

    // Update requirements checklist
    this.updateRequirements(result.checks);
  }

  private updateRequirements(checks: any): void {
    const requirements = this.container.querySelectorAll('.requirement');
    
    requirements.forEach((req) => {
      const checkType = req.getAttribute('data-check') as keyof typeof checks;
      const icon = req.querySelector('.requirement-icon') as HTMLElement;
      
      if (icon && checkType in checks) {
        if (checks[checkType]) {
          icon.textContent = '✅';
          icon.style.color = '#00aa00';
          req.classList.add('requirement-met');
          req.classList.remove('requirement-not-met');
        } else {
          icon.textContent = '❌';
          icon.style.color = '#ff4444';
          req.classList.add('requirement-not-met');
          req.classList.remove('requirement-met');
        }
      }
    });
  }

  /**
   * Get current password validation result
   */
  getValidationResult(): PasswordCheck {
    return this.checker.checkPassword(this.passwordInput.value);
  }
}

// CSS styles for the password strength indicator
export const passwordStrengthStyles = `
.password-strength-indicator {
  margin-top: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.password-strength-bar {
  width: 100%;
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.password-strength-fill {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
  border-radius: 3px;
}

.password-strength-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
}

.strength-level {
  font-weight: 600;
  transition: color 0.3s ease;
}

.strength-description {
  color: #666;
  font-size: 12px;
}

.password-requirements {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.requirement {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  transition: all 0.3s ease;
}

.requirement-icon {
  font-size: 14px;
  transition: color 0.3s ease;
}

.requirement-text {
  color: #666;
}

.requirement-met .requirement-text {
  color: #00aa00;
  font-weight: 500;
}

.requirement-not-met .requirement-text {
  color: #ff4444;
}

/* Responsive design */
@media (max-width: 480px) {
  .password-requirements {
    gap: 2px;
  }
  
  .requirement {
    font-size: 11px;
  }
}
`;

// Auto-initialize if DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Auto-initialize password strength indicators
    const passwordInputs = document.querySelectorAll('input[type="password"][data-password-strength]');
    passwordInputs.forEach((input) => {
      const container = document.getElementById(input.getAttribute('data-password-strength') || 'password-strength-container');
      if (container) {
        new PasswordStrengthIndicator(input as HTMLInputElement, container);
      }
    });
  });
}
