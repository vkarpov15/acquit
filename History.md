0.6.3 / 2018-05-04
==================
 * fix(parse): format `it()` block `code` to remove extra indents

0.6.2 / 2018-03-31
==================
 * fix(parse): filter out leading comments that are in previous blocks due to esprima quirks

0.6.1 / 2018-03-08
==================
 * fix: support `context` and `specify` as aliases for `describe` and `it`

0.6.0 / 2018-01-15
==================
 * fix: only take last comment from each block to avoid esprima pulling incorrect comments

0.5.0 / 2017-07-17
==================
 * chore: upgrade to latest esprima and lodash

0.4.1 / 2015-12-07
==================
 * chore: update marked for security patch [ChristianMurphy](ChristianMurphy)

0.4.0 / 2015-10-23
==================
 * added; `.output()` function for chainable output processors

0.3.0 / 2015-09-03
==================
 * added; constructor to isolate transforms #7

0.2.0 / 2015-08-28
==================
 * added; `.transform()`
