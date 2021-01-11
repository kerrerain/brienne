function _createTerm(...regex) {
  return {
    regex: regex.map((n) => new RegExp(n, 'mi')),
    exists: false,
    links: [],
  };
}

function create(url) {
  return {
    url,
    errors: [],
    subpages: [],
    reachable: false,
    terms: {
      A11Y_1: _createTerm('accessibilité'),
      A11Y_4: _createTerm('%'),
      A11Y_5: _createTerm('W3C'),
      A11Y_6: _createTerm('WCAG'),
      RGAA_1: _createTerm('déclaration de conformité|déclaration d\'accessibilité'),
      RGAA_7_1: _createTerm('RGAA', 'RGAA 2|RGAA2|v2|version 2'),
      RGAA_7_2: _createTerm('RGAA', 'RGAA 3|RGAA3|v3|version 3'),
      RGAA_7_3: _createTerm('RGAA', 'RGAA 4|RGAA4|v4|version 4'),
      RGAA_8: _createTerm('page d\'aide'),
      RGAA_9: _createTerm('schéma pluriannuel'),
      RGAA_10: _createTerm('plan d\'actions'),
    },
  };
}

module.exports = {
  create,
};
