1.3.0 / 2022-02-20
==================
 * fix: upgrade dependencies #28 [Uzlopak](https://github.com/Uzlopak)

1.2.1 / 2020-09-25
==================
 * fix: downgrade to marked v0.7.x for Node v4 support #25

1.2.0 / 2020-09-25
==================
 * fix: upgrade to marked v1.1.x for security fixes #25 [rob4629](https://github.com/rob4629)

1.1.0 / 2020-08-18
==================
 * feat: support `import` statements by using esprima `parseModule()` #22

1.0.5 / 2019-06-15
==================
 * fix: fix crash on node 4.x

1.0.4 / 2019-06-15
==================
 * refactor: remove lodash dependency re: security vulnerabilities

1.0.2 / 2018-12-16
==================
 * chore: upgrade serve re: security vulnerability

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
