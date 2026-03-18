import type { IProblem } from '../types/problem'

export const problem: IProblem = {
  _id: '69b9b6375633078ee62c9c70',
  problemNo: 70,
  name: 'Climbing Stairs',
  tags: [
    {
      _id: '69b9b637d41ca87520868ba8',
      name: 'Dynamic Programming',
      __v: 0,
      count: 1,
      createdAt: '2026-03-17T20:14:47.545Z',
      slug: 'dynamic_programming',
      updatedAt: '2026-03-17T20:14:47.545Z',
    },
    {
      _id: '69b9b637d41ca87520868baa',
      name: 'Math',
      __v: 0,
      count: 1,
      createdAt: '2026-03-17T20:14:47.545Z',
      slug: 'math',
      updatedAt: '2026-03-17T20:14:47.545Z',
    },
    {
      _id: '69b9b637d41ca87520868ba9',
      name: 'Memoization',
      __v: 0,
      count: 1,
      createdAt: '2026-03-17T20:14:47.545Z',
      slug: 'memoization',
      updatedAt: '2026-03-17T20:14:47.545Z',
    },
  ],
  solutions: [
    {
      _id: '69b9b6375633078ee62c9c72',
      problemId: '69b9b6375633078ee62c9c70',
      solutions: [
        'For the top down approach, the base cases are when one of the string is empty, return the length of the other string',
        'If the characters at the indices are equal, we can just move to the smaller substring',
        'If the characters are not equal, then we have perform replacement, deletion or addition and find the minimum value of these operations + 1',
      ],
      __v: 0,
    },
    {
      _id: '69b9b6375633078ee62c9c73',
      problemId: '69b9b6375633078ee62c9c70',
      solutions: [
        'For bottom up approach, we do the same thing starting from empty strings and populating the first row and column',
        'Then use the same recursive formula to solve the problem',
      ],
      __v: 0,
    },
  ],
  datesAttempted: ['2026-03-17'],
  __v: 1,
  dpPoints: {
    _id: '69b9b6375633078ee62c9c77',
    problemId: '69b9b6375633078ee62c9c70',
    solutions: [
      'Recurrence Relation: dp[n] = dp[n - 1] + dp[n - 2]',
      'Base Cases: dp[1] = 1, dp[2] = 2',
    ],
    __v: 0,
  },
  pointsToRemember: {
    _id: '69b9b6375633078ee62c9c75',
    problemId: '69b9b6375633078ee62c9c70',
    solutions: [
      'If we start from the 0th index, we have to return the len of s - index as base case',
      'This is essentially the Fibonacci sequence. Space can be optimized to O(1) by only keeping track of the last two values instead of a full DP array.',
    ],
    __v: 0,
  },
}
