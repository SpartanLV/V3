// src/utils/roleUtils.js
export function inferRoleFromEmail(email) {
    const domain = email.split('@')[1]?.toLowerCase();
    if (domain === 'g.bracu.ac.bd') return 'student';
    if (domain === 'bracu.ac.bd')   return 'staff';
    return null;
  }
  