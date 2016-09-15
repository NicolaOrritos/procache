
'use strict'

const keys = {}
const hitsListeners = {}
const missHandlers  = {}

/* const POLICY =
{
    SECONDS: function(seconds)
    {},

    HITS: function(hits)
    {},

    NEVER: -16,
    ALWAYS: -2,
} */


function isNull(val)
{
    return (val === undefined || val === null)
}

function isntNull(val)
{
    return (val !== undefined && val !== null)
}

function isString(val)
{
    return (typeof val === 'string' || val instanceof String)
}

function isFunction(val)
{
    const getType = {};

    return (val && getType.toString.call(val) === '[object Function]');
}


function callMissHandler(key)
{
    if (isntNull(key))
    {
        const fn = missHandlers[key]

        if (isFunction(fn))
        {
            console.log('Calling miss-handler for key "%s"...', key)

            fn( value =>
            {
                keys[key] = value

                hitsListeners[key].forEach( fn => fn(value) )
            })
        }
    }
}


class CacheOperator
{
    constructor(key)
    {
        if (isString(key))
        {
            this.key = key

            if (isNull(hitsListeners[this.key]))
            {
                hitsListeners[this.key] = []
            }
        }
        else
        {
            throw new Error('Missing key')
        }
    }

    // cb = function(value)
    hit (cb)
    {
        if (isFunction(cb))
        {
            hitsListeners[this.key].push(cb)
        }

        if (isntNull(keys[this.key]))
        {
            cb(keys[this.key])
        }
        else
        {
            callMissHandler(this.key)
        }

        return this
    }

    // cb = function(function(value))
    miss (cb)
    {
        if (isFunction(cb))
        {
            missHandlers[this.key] = cb

            callMissHandler(this.key)
        }

        return this
    }

    // cb = function(save = function(policy))
    /* invalidate (cb)
    {} */

    // Straight return of the value
    get ()
    {
        if (isNull(missHandlers[this.key]))
        {
            throw new Error('Lacking miss-handler function')
        }
        else
        {
            return keys[this.key]
        }
    }
}


module.exports = function(key)
{
    return new CacheOperator(key)
}
