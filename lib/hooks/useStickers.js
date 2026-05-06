'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { CATALOG_BY_ID } from '@/lib/catalog/catalog'

const EDITION = 'panini_wc_2026'

/**
 * Hook central del álbum.
 * Maneja el estado local + sync con Supabase.
 * userId=null => solo estado en memoria (sin Supabase)
 * userId=uuid  => sync a Supabase con update optimista
 */
export function useStickers(userId) {
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [lastEdits, setLastEdits] = useState([])
  const pendingSync = useRef({})
  const syncTimer = useRef(null)
  const countsRef = useRef(counts)

  // Mantener ref actualizada para el undo sin capturar closures stale
  useEffect(() => {
    countsRef.current = counts
  }, [counts])

  // Cargar desde Supabase al montar (solo si hay userId)
  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    async function load() {
      // Import dinámico para no instanciar Supabase si no hay userId
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      const { data, error } = await supabase
        .from('user_stickers')
        .select('sticker_id, count')
        .eq('user_id', userId)

      if (!error && data) {
        const map = {}
        data.forEach(({ sticker_id, count }) => {
          const localId = sticker_id.startsWith(`${EDITION}:`)
            ? sticker_id.slice(EDITION.length + 1)
            : sticker_id
          map[localId] = count
        })
        setCounts(map)
      }
      setLoading(false)
    }

    load()
  }, [userId])

  // Flush pendingSync a Supabase
  const flushSync = useCallback(async () => {
    if (!userId) return
    const snapshot = { ...pendingSync.current }
    pendingSync.current = {}

    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()

    const upserts = Object.entries(snapshot).map(([localId, count]) => ({
      user_id: userId,
      sticker_id: `${EDITION}:${localId}`,
      count,
      updated_at: new Date().toISOString(),
    }))

    const toDelete = upserts.filter((u) => u.count === 0)
    const toUpsert = upserts.filter((u) => u.count > 0)

    if (toUpsert.length) {
      await supabase.from('user_stickers').upsert(toUpsert)
    }
    for (const d of toDelete) {
      await supabase
        .from('user_stickers')
        .delete()
        .eq('user_id', userId)
        .eq('sticker_id', d.sticker_id)
    }
  }, [userId])

  // Ajustar count de un sticker (+1 / -1), retorna el resultado para el toast
  const adjust = useCallback(
    (stickerId, delta) => {
      const before = countsRef.current[stickerId] || 0
      const after = Math.max(0, before + delta)
      if (before === after) return null

      const sticker = CATALOG_BY_ID[stickerId]
      const result = { id: stickerId, before, after, sticker }

      // Guardar en stack de undo antes de actualizar
      setLastEdits((prev) => [...prev.slice(-19), { id: stickerId, before }])

      setCounts((prev) => {
        const next = { ...prev }
        if (after === 0) delete next[stickerId]
        else next[stickerId] = after
        return next
      })

      // Sync a Supabase con debounce
      if (userId) {
        pendingSync.current[stickerId] = after
        clearTimeout(syncTimer.current)
        syncTimer.current = setTimeout(flushSync, 800)
      }

      return result
    },
    [userId, flushSync]
  )

  // Deshacer el último cambio
  const undo = useCallback(() => {
    setLastEdits((prev) => {
      if (!prev.length) return prev
      const last = prev[prev.length - 1]

      setCounts((c) => {
        const next = { ...c }
        if (last.before === 0) delete next[last.id]
        else next[last.id] = last.before
        return next
      })

      if (userId) {
        pendingSync.current[last.id] = last.before
        clearTimeout(syncTimer.current)
        syncTimer.current = setTimeout(flushSync, 800)
      }

      return prev.slice(0, -1)
    })
  }, [userId, flushSync])

  const getCount = useCallback((id) => counts[id] || 0, [counts])

  return { counts, loading, adjust, undo, getCount, lastEdits }
}
