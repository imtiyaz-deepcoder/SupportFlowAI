const { searchKnowledgeBase } = require('../src/services/knowledge-base.service');

console.log('Test 1 - login issue:');
console.log(searchKnowledgeBase('My login wont work, password issue'));

console.log('\nTest 2 - billing issue:');
console.log(searchKnowledgeBase('I was charged twice on my invoice'));

console.log('\nTest 3 - no match:');
console.log(searchKnowledgeBase('The website colors look strange today'));
