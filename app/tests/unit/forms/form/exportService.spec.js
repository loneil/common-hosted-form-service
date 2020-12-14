const exportService = require('../../../../src/forms/form/exportService');

describe('Test Export Service functions', () => {

  describe('_excludeData function', () => {

    it('returns blank data when nothing supplied', () => {
      expect(exportService._excludeData()).toEqual({});
    });

    it('returns supplied data when blank params supplied', () => {
      const data = { test: 123};
      expect(exportService._excludeData({}, data)).toEqual(data);
      expect(exportService._excludeData(undefined, data)).toEqual(data);
      expect(exportService._excludeData(null, data)).toEqual(data);
    });

    it('returns supplied data when params without exclusion supplied', () => {
      const data = { test: 123};
      expect(exportService._excludeData({ someParam: 'test'}, data)).toEqual(data);
    });
  });
});
