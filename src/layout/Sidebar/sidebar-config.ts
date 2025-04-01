export const pathToKeyMap: { [key: string]: string[] } = {
  '/': ['1'],
  '/start-assessments': ['2'],
  '/ongoing-assessments': ['3'],
  '/assessment-results': ['4'],
  '/organizations': ['5'],
  '/normative-documents': ['6'],
  // '/checklist': ['7'],
  '/settings/indicator-types': ['7', '7.1'],
  '/settings/indicators': ['7', '7.2'],
  '/settings/users': ['7', '7.3'],
  '/settings/organizations': ['7', '7.4'],
  '/settings/checklists': ['7', '7.5'],
  '/settings/normative-documents': ['7', '7.6'],
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
  backgroundColor: '#003a4f',
};
