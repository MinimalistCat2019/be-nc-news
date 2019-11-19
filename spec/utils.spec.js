const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments,
} = require('../db/utils/utils');

describe('formatDates', () => {
  it('returns a new empty array when passed empty array', () => {
    let inputArray = [];
    let actual = formatDates(inputArray);
    let expected = [];
    expect(actual).to.deep.equal(expected);
    expect(actual).to.not.equal(inputArray);
  });
  it('returns an array with a single object containing a created at value in format of a javascript date object when passed an array containing a single object with a created at value as a timestamp', () => {
    let inputArray = [{
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: 1542284514171,
      votes: 100,
    }];
    let actual = formatDates(inputArray);
    let javascriptDateObject = new Date(1542284514171);
    let expected = [{
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: javascriptDateObject,
      votes: 100,
    }];
    expect(actual).to.deep.equal(expected);
  });
  it('returns an array of objects containing a created at value in format of a javascript date object when passed an array of objects with a created at value as a timestamp', () => {
    let inputArray = [{
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: 1542284514171,
      votes: 100,
    },
    {
      title: 'UNCOVERED: catspiracy to bring down democracy',
      topic: 'cats',
      author: 'rogersop',
      body: 'Bastet walks amongst us, and the cats are taking arms!',
      created_at: 1037708514171,
    },
    {
      title: 'A',
      topic: 'mitch',
      author: 'icellusedkars',
      body: 'Delicious tin of cat food',
      created_at: 911564514171,
    }];
    let actual = formatDates(inputArray);
    let expected = [{
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: new Date(1542284514171),
      votes: 100,
    },
    {
      title: 'UNCOVERED: catspiracy to bring down democracy',
      topic: 'cats',
      author: 'rogersop',
      body: 'Bastet walks amongst us, and the cats are taking arms!',
      created_at: new Date(1037708514171),
    },
    {
      title: 'A',
      topic: 'mitch',
      author: 'icellusedkars',
      body: 'Delicious tin of cat food',
      created_at: new Date(911564514171),
    }];
    expect(actual).to.deep.equal(expected);
  })
  
});

describe('makeRefObj', () => {
  it('returns an empty object, when passed an empty array', () => {
    const inputArray = [];
    const actual = makeRefObj(inputArray);
    const expected = {};
    expect(actual).to.deep.equal(expected);
  });
  it('returns an object of key:value pairs of title:article_id  when passed an array containing a single object', () => {
    const inputArray = [{
      article_id: 1,
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      votes: 100
    }];
    const actual = makeRefObj(inputArray);
    const expected = {'Living in the shadow of a great man': 1};
    expect(actual).to.deep.equal(expected);
  });
  it('returns an object of key:value pairs of title:article_id  when passed an array of objects', () => {
    const inputArray = [{
      article_id: 1,
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      votes: 100
    },
    {
      article_id: 2,
      title: 'UNCOVERED: catspiracy to bring down democracy',
      topic: 'cats',
      author: 'rogersop',
      body: 'Bastet walks amongst us, and the cats are taking arms!'
    },
    {
      article_id: 3,
      title: 'A',
      topic: 'mitch',
      author: 'icellusedkars',
      body: 'Delicious tin of cat food'
    }];
    const actual = makeRefObj(inputArray);
    const expected = {'Living in the shadow of a great man': 1, 'UNCOVERED: catspiracy to bring down democracy': 2, 'A': 3 
  };
    expect(actual).to.deep.equal(expected);
  });
});

describe('formatComments', () => {
  it('returns a new empty array when passed an empty array and a reference object', () => {
    const inputArray = [];
    const actual = formatComments(inputArray);
    const expected = [];
    expect(actual).to.deep.equal(expected);
    expect(actual).to.not.equal(inputArray);
  });
  it('returns a new array of objects with their `created_by` property renamed to an `author` key and their belongs_to property renamed to article_id key  with a value of original title value, its created_at value converted into a javascript object and all other properties maintained', () => {
    const inputArray = [{
      body: 'This is a bad article name',
      belongs_to: 'A',
      created_by: 'butter_bridge',
      votes: 1,
      created_at: 1038314163389
    },
    {
      body: 'The owls are not what they seem.',
      belongs_to: "They're not exactly dogs, are they?",
      created_by: 'icellusedkars',
      votes: 20,
      created_at: 1006778163389
    },
    {
      body: 'This morning, I showered for nine minutes.',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 975242163389
    }];
    const fakeRefObj = {'A': 3, "They're not exactly dogs, are they?": 1, 'Living in the shadow of a great man': 2 }
    const actual = formatComments(inputArray, fakeRefObj);
    const expected = [{
      body: 'This is a bad article name',
      article_id: 3,
      author: 'butter_bridge',
      votes: 1,
      created_at: new Date(1038314163389)
    },
    {
      body: 'The owls are not what they seem.',
      article_id: 1,
      author: 'icellusedkars',
      votes: 20,
      created_at: new Date(1006778163389)
    },
    {
      body: 'This morning, I showered for nine minutes.',
      article_id: 2,
      author: 'butter_bridge',
      votes: 16,
      created_at: new Date(975242163389)
    }];
    expect(actual).to.deep.equal(expected);
    expect(actual).to.not.equal(inputArray);
  });
});
