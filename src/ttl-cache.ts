export interface CacheEntry<T> {
  value: T
  ttl: number
}

export class TTLCache<T = unknown> {
  /**
   * An entry's Time To Live before it gets discarded
   */
  public readonly ttl: number

  private cache: Map<string, CacheEntry<T>>

  /**
   * @params ttl Entry Time To Live before being discarded
   */
  constructor(ttl: number) {
    this.ttl = ttl
    this.cache = new Map<string, CacheEntry<T>>()
  }

  /**
   * Adds a entry into the cache
   * 
   * @params key The key of the entry to be added
   * @params value The value of the entry
   * 
   * @returns true | false
   */
  public add(key: string, value: T): boolean {
    if (!key) throw Error('A key is required!')
    if (!value) throw Error('A value is required!')


    if (this.cache.has(key)) {
      return true
    }

    // Add the entry to the cache
    this.cache.set(key, { value, ttl: this.ttl })
    // Discard the entry when it's time...
    this._discard(key)

    return true
  }

  /**
   * Fetches the entry from the cache. Returns null if the entry does not exist
   * 
   * @params key The key of the entry
   * 
   * @returns The value of the entry
   */
  public get(key: string): T | null {
    if (!key) throw new Error('A key is required')

    const result = this.cache.get(key)

    if (!result) return null

    return result.value
  }

  /**
   * Similar to `get` but returns the raw Entry object
   * 
   * @returns CacheEntry
   */
  public _get(key: string): CacheEntry<T> | null {
    if (!key) throw new Error('A key is required')

    const result = this.cache.get(key)

    if (!result) return null

    return result
  }

  /**
   * Update an entry's value. This does not reset the entry TTL
   * 
   * @param key The key of the entry
   * @param value The value to replace the old entry value
   */
  public update(key: string, value: T): boolean {
    if (!key) throw Error('A key is required!')
    if (!value) throw Error('A value is required!')

    const current = this._get(key)

    if (!current) return false

    this.cache.set(key, { value, ttl: current.ttl })

    return true
  }

  /**
   * Removes a entry from the cache
   * 
   * @param key The key of the entry
   * 
   * @returns true | false
   */
  public remove(key: string): boolean {
    if (!key) throw Error('A key is required!')
    if (!this.cache.has(key)) return false

    return this.cache.delete(key)
  }

  private _discard(key: string): NodeJS.Timeout {
    return setTimeout(() => this.remove(key), this.ttl)
  }
}
