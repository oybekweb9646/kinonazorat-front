export const pathToKeyMap: { [key: string]: string[] } = {
  '/': ['1'],
  '/start-assessments': ['2'],
  '/ongoing-assessments': ['3'],
  '/assessment-results': ['4'],
  '/organizations': ['5'],
  '/normative-documents': ['6'],
  '/checklist': ['7'],
  '/settings/indicator-types': ['8', '8.1'],
  '/settings/indicators': ['8', '8.2'],
  '/settings/users': ['8', '8.3'],
  '/settings/organizations': ['8', '8.4'],
  '/settings/checklists': ['8', '8.5'],
  '/settings/normative-documents': ['8', '8.6'],
};

export const siderStyle: React.CSSProperties = {
  overflow: 'auto',
  height: '100vh',
  position: 'sticky',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
};
