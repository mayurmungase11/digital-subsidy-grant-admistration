export const roleConfig = {
  ADMIN: {
    label: 'Administrator',
    homePath: '/admin',
  },
  BENEFICIARY: {
    label: 'Beneficiary',
    homePath: '/beneficiary',
  },
  FIELD_OFFICER: {
    label: 'Field Officer',
    homePath: '/field-officer',
  },
  DISTRICT_OFFICER: {
    label: 'District Officer',
    homePath: '/district-officer',
  },
  FINANCE_OFFICER: {
    label: 'Finance Officer',
    homePath: '/finance-officer',
  },
};

export function getRoleConfig(role) {
  return roleConfig[role] || null;
}

export function getNavigationItems(role) {
  const config = getRoleConfig(role);
  if (!config) return [];

  return [
    { section: 'Overview', label: 'Dashboard', path: config.homePath, icon: '▦' },
    { section: 'Operations', label: 'Schemes', path: `${config.homePath}/schemes`, icon: '▤' },
    { section: 'Operations', label: 'Applications', path: `${config.homePath}/applications`, icon: '▥' },
    ...(role === 'BENEFICIARY' ? [{ section: 'Account', label: 'My Profile', path: `${config.homePath}/profile`, icon: 'P' }] : []),
    ...(role === 'ADMIN' || role === 'FIELD_OFFICER' || role === 'DISTRICT_OFFICER' ? [{ section: 'Workflow', label: 'Beneficiaries', path: `${config.homePath}/beneficiaries`, icon: 'B' }] : []),
    ...(role === 'ADMIN' || role === 'FIELD_OFFICER' || role === 'DISTRICT_OFFICER' ? [{ section: 'Workflow', label: 'Verification', path: `${config.homePath}/verifications`, icon: '✓' }] : []),
    ...(role === 'ADMIN' || role === 'DISTRICT_OFFICER' ? [{ section: 'Workflow', label: 'Approval', path: `${config.homePath}/approvals`, icon: 'A' }] : []),
    ...(role === 'ADMIN' || role === 'FINANCE_OFFICER' ? [{ section: 'Workflow', label: 'Disbursement', path: `${config.homePath}/disbursements`, icon: '₹' }] : []),
    ...(role === 'ADMIN' ? [{ section: 'Administration', label: 'User Management', path: `${config.homePath}/users`, icon: 'U' }] : []),
    ...(role === 'ADMIN' ? [{ section: 'Administration', label: 'Role Management', path: `${config.homePath}/roles`, icon: 'R' }] : []),
    ...(['ADMIN', 'FIELD_OFFICER', 'DISTRICT_OFFICER', 'FINANCE_OFFICER'].includes(role) ? [{ section: 'Administration', label: 'Master Data', path: `${config.homePath}/master-data`, icon: 'M' }] : []),
  ];
}
