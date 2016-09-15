
'use strict'

const cache = require('./procache')

console.log('Via "get()": %s', cache('foo')
.miss( save => save('bar') )
.hit( value => console.log('Via first  "hit()": %s', value) )
.hit( value => console.log('Via second "hit()": %s', value) )
.get())

console.log('---------------------')

console.log('Via "get()": %s', cache('foo2')
.hit( value => console.log('Via first  "hit()": %s', value) )
.hit( value => console.log('Via second "hit()": %s', value) )
.miss( save => save('bar2') )
.get())

console.log('Via "get()": %s', cache('foo3').get())
