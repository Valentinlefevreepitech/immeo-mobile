/**
 * Tests pour les helpers de validation du formulaire login/register.
 * Les fonctions sont extraites ici en miroir de celles definies dans login.tsx.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Veuillez saisir votre adresse email.';
  if (!EMAIL_REGEX.test(email.trim())) return 'Adresse email invalide.';
  return null;
}

function getPasswordStrength(password: string) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const score = Object.values(checks).filter(Boolean).length;
  return { checks, score };
}

function validatePassword(password: string): string | null {
  if (!password) return 'Veuillez saisir un mot de passe.';
  if (password.length < 8) return 'Le mot de passe doit contenir au moins 8 caracteres.';
  return null;
}

function validateRegisterPassword(password: string): string | null {
  if (!password) return 'Veuillez saisir un mot de passe.';
  const { checks } = getPasswordStrength(password);
  if (!checks.length) return 'Le mot de passe doit contenir au moins 8 caracteres.';
  if (!checks.uppercase) return 'Le mot de passe doit contenir au moins une majuscule.';
  if (!checks.number) return 'Le mot de passe doit contenir au moins un chiffre.';
  return null;
}

// ── validateEmail ──

describe('validateEmail', () => {
  it('retourne une erreur si email vide', () => {
    expect(validateEmail('')).toBe('Veuillez saisir votre adresse email.');
    expect(validateEmail('   ')).toBe('Veuillez saisir votre adresse email.');
  });

  it('retourne une erreur si email invalide', () => {
    expect(validateEmail('abc')).toBe('Adresse email invalide.');
    expect(validateEmail('abc@')).toBe('Adresse email invalide.');
    expect(validateEmail('abc@def')).toBe('Adresse email invalide.');
    expect(validateEmail('@def.com')).toBe('Adresse email invalide.');
  });

  it('accepte un email valide', () => {
    expect(validateEmail('user@example.com')).toBeNull();
    expect(validateEmail('test.user@domain.fr')).toBeNull();
    expect(validateEmail('  user@example.com  ')).toBeNull();
  });
});

// ── validatePassword (login) ──

describe('validatePassword', () => {
  it('retourne une erreur si mot de passe vide', () => {
    expect(validatePassword('')).toBe('Veuillez saisir un mot de passe.');
  });

  it('retourne une erreur si mot de passe trop court', () => {
    expect(validatePassword('1234567')).toBe(
      'Le mot de passe doit contenir au moins 8 caracteres.',
    );
  });

  it('accepte un mot de passe de 8+ caracteres', () => {
    expect(validatePassword('12345678')).toBeNull();
    expect(validatePassword('motdepasse')).toBeNull();
  });
});

// ── getPasswordStrength ──

describe('getPasswordStrength', () => {
  it('retourne score 0 pour un mot de passe vide', () => {
    expect(getPasswordStrength('').score).toBe(0);
  });

  it('retourne score 1 pour longueur seule', () => {
    const result = getPasswordStrength('abcdefgh');
    expect(result.score).toBe(1);
    expect(result.checks.length).toBe(true);
    expect(result.checks.uppercase).toBe(false);
  });

  it('retourne score 4 pour un mot de passe fort', () => {
    const result = getPasswordStrength('Passw0rd!');
    expect(result.score).toBe(4);
    expect(result.checks.length).toBe(true);
    expect(result.checks.uppercase).toBe(true);
    expect(result.checks.number).toBe(true);
    expect(result.checks.special).toBe(true);
  });

  it('detecte chaque critere individuellement', () => {
    expect(getPasswordStrength('A').checks.uppercase).toBe(true);
    expect(getPasswordStrength('1').checks.number).toBe(true);
    expect(getPasswordStrength('!').checks.special).toBe(true);
    expect(getPasswordStrength('12345678').checks.length).toBe(true);
  });
});

// ── validateRegisterPassword ──

describe('validateRegisterPassword', () => {
  it('retourne une erreur si vide', () => {
    expect(validateRegisterPassword('')).toBe('Veuillez saisir un mot de passe.');
  });

  it('retourne une erreur si trop court', () => {
    expect(validateRegisterPassword('Ab1')).toBe(
      'Le mot de passe doit contenir au moins 8 caracteres.',
    );
  });

  it('retourne une erreur si pas de majuscule', () => {
    expect(validateRegisterPassword('abcdefg1')).toBe(
      'Le mot de passe doit contenir au moins une majuscule.',
    );
  });

  it('retourne une erreur si pas de chiffre', () => {
    expect(validateRegisterPassword('Abcdefgh')).toBe(
      'Le mot de passe doit contenir au moins un chiffre.',
    );
  });

  it('accepte un mot de passe valide', () => {
    expect(validateRegisterPassword('Abcdefg1')).toBeNull();
    expect(validateRegisterPassword('Passw0rd!')).toBeNull();
  });
});
