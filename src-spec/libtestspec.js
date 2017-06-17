/*global zscript zs metazen beforeAll expect fit fdefine spyOn*/

describe('lib/test.zs', function () {
  it('can be imported', function () {
    zs.require('lib.test', 'lib/test.zs');
  });
});
