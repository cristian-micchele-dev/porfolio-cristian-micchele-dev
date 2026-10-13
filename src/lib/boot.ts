/**
 * Clave de sesión del boot sequence.
 *
 * Vive en un módulo SIN `'use client'` a propósito. Next envuelve todos los
 * exports de un módulo cliente como referencias de cliente, así que importar
 * esta constante desde `BootSkip.tsx` hacía que el script inline del layout
 * —que es un Server Component— interpolara un stub de error en lugar del
 * valor, dejando el "una vez por sesión" roto en silencio.
 *
 * Typecheck y lint no detectan eso. Sólo se ve mirando el HTML servido.
 */
export const BOOT_STORAGE_KEY = 'cristian-dev:booted'
