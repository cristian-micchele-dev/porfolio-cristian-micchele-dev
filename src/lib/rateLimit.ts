export interface RateLimitResult {
  allowed: boolean
  /** Peticiones restantes en la ventana actual. */
  remaining: number
  /** Timestamp en ms en que se reinicia la ventana. */
  resetAt: number
}

export interface RateLimiterOptions {
  limit: number
  windowMs: number
  /** Inyectable para testear sin timers falsos. */
  now?: () => number
  /** Techo de claves en memoria, para que el Map no crezca sin límite. */
  maxKeys?: number
}

interface Bucket {
  count: number
  resetAt: number
}

/**
 * Rate limiter de ventana fija, en memoria.
 *
 * Limitación conocida y asumida: en serverless cada instancia tiene su propio
 * Map, así que el límite efectivo se multiplica por la cantidad de instancias
 * activas. Para proteger un endpoint de portfolio alcanza y no cuesta nada.
 * Si en algún momento hay una API de IA paga detrás, esto se reemplaza por un
 * store compartido (Upstash o similar) sin tocar el route handler: la firma
 * ya es la que corresponde.
 */
export function createRateLimiter({
  limit,
  windowMs,
  now = Date.now,
  maxKeys = 10_000,
}: RateLimiterOptions) {
  const buckets = new Map<string, Bucket>()

  return function check(key: string): RateLimitResult {
    const current = now()
    const bucket = buckets.get(key)

    if (!bucket || current >= bucket.resetAt) {
      // Poda perezosa: sólo cuando se cruza el techo, y sólo lo vencido.
      if (buckets.size >= maxKeys) {
        for (const [existingKey, existing] of buckets) {
          if (current >= existing.resetAt) buckets.delete(existingKey)
        }
      }

      const resetAt = current + windowMs
      buckets.set(key, { count: 1, resetAt })
      return { allowed: true, remaining: limit - 1, resetAt }
    }

    if (bucket.count >= limit) {
      return { allowed: false, remaining: 0, resetAt: bucket.resetAt }
    }

    bucket.count += 1
    return { allowed: true, remaining: limit - bucket.count, resetAt: bucket.resetAt }
  }
}
