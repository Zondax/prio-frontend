'use client'

import { DebugGrid } from '@/components/debug/debug-grid'
import DebugLayout from '@/components/debug/debug-layout'
// DebugScenarioWrapper is no longer needed as we are creating multiple direct grid scenarios
import { PromoCard } from '@/components/explore/promo-card'

export default function PromoCardPage() {
  const promoItems = [
    { id: '1', title: 'Promo 1' },
    { id: '2', title: 'Promo 2' },
    { id: '3', title: 'Promo 3' },
    { id: '4', title: 'Promo 4' },
    { id: '5', title: 'Promo 5' },
    { id: '6', title: 'Promo 6' },
  ]

  return (
    <DebugLayout index={2}>
      <h1 className="text-2xl font-bold mb-6">Promo Card Grid Configurations</h1>

      <DebugGrid title="3 Columns, default colSpan=1" numCols={3} childColSpan={1}>
        {promoItems.slice(0, 3).map((item) => (
          <PromoCard key={item.id} id={item.id} title={item.title} />
        ))}
      </DebugGrid>

      <DebugGrid title="4 Columns, default colSpan=1, one item colSpan=2" numCols={4} childColSpan={1}>
        {promoItems.slice(0, 3).map((item) => (
          <PromoCard key={item.id} id={item.id} title={item.title} />
        ))}
        <PromoCard key={promoItems[3].id} id={promoItems[3].id} title={promoItems[3].title} colSpan={2} />
      </DebugGrid>

      <DebugGrid title="2 Columns, default colSpan=1" numCols={2} childColSpan={1}>
        {promoItems.map((item) => (
          <PromoCard key={item.id} id={item.id} title={item.title} />
        ))}
      </DebugGrid>

      <DebugGrid title="6 Columns, varying explicit colSpans" numCols={6} childColSpan={1}>
        <PromoCard key={promoItems[0].id} id={promoItems[0].id} title={promoItems[0].title} colSpan={2} />
        <PromoCard key={promoItems[1].id} id={promoItems[1].id} title={promoItems[1].title} colSpan={1} />
        <PromoCard key={promoItems[2].id} id={promoItems[2].id} title={promoItems[2].title} colSpan={3} />
        <PromoCard key={promoItems[3].id} id={promoItems[3].id} title={promoItems[3].title} colSpan={1} />
        <PromoCard key={promoItems[4].id} id={promoItems[4].id} title={promoItems[4].title} colSpan={5} />
      </DebugGrid>

      {/* --- New Test Cases --- */}

      <DebugGrid title="Grid: 3 cols, Children default: colSpan=2 (causes wrapping/overflow)" numCols={3} childColSpan={2}>
        {promoItems.slice(0, 2).map((item) => (
          <PromoCard key={item.id} id={item.id} title={item.title} />
        ))}
      </DebugGrid>

      <DebugGrid title="Grid: 5 cols, Children default: colSpan=1 (many items)" numCols={5} childColSpan={1}>
        {promoItems.map((item) => (
          <PromoCard key={item.id} id={item.id} title={item.title} />
        ))}
      </DebugGrid>

      <DebugGrid title="Grid: 4 cols, Single child: explicit colSpan=4" numCols={4} childColSpan={1}>
        <PromoCard key={promoItems[0].id} id={promoItems[0].id} title={promoItems[0].title} colSpan={4} />
      </DebugGrid>

      <DebugGrid title="Grid: 6 cols, Mixed: default colSpan=1, some explicit (complex layout)" numCols={6} childColSpan={1}>
        <PromoCard key={promoItems[0].id} id={promoItems[0].id} title={`${promoItems[0].title} (default)`} />
        <PromoCard key={promoItems[1].id} id={promoItems[1].id} title={`${promoItems[1].title} (colSpan=2)`} colSpan={2} />
        <PromoCard key={promoItems[2].id} id={promoItems[2].id} title={`${promoItems[2].title} (default)`} />
        <PromoCard key={promoItems[3].id} id={promoItems[3].id} title={`${promoItems[3].title} (colSpan=3)`} colSpan={3} />
        <PromoCard key={promoItems[4].id} id={promoItems[4].id} title={`${promoItems[4].title} (default)`} />
      </DebugGrid>

      <DebugGrid title="Grid: 2 cols, Children default: colSpan=2" numCols={2} childColSpan={2}>
        {promoItems.slice(0, 3).map((item) => (
          <PromoCard key={item.id} id={item.id} title={item.title} />
        ))}
      </DebugGrid>
    </DebugLayout>
  )
}
