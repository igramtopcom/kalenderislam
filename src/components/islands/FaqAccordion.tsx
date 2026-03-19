// src/components/islands/FaqAccordion.tsx
import { useState } from 'preact/hooks';

interface FaqItem {
  question: string;
  answer:   string;
}

interface Props {
  items: FaqItem[];
}

export default function FaqAccordion({ items }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div class="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          class="rounded-xl overflow-hidden transition-all duration-150"
          style="border:1px solid rgba(29,107,66,.12);"
        >
          <button
            type="button"
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            class="w-full flex items-center justify-between px-5 py-4 text-left
                   cursor-pointer transition-colors duration-150"
            style={openIdx === i ? 'background:var(--green-50);' : 'background:white;'}
            aria-expanded={openIdx === i}
          >
            <span class="text-[0.9rem] font-semibold pr-4" style="color:var(--ink);">
              {item.question}
            </span>
            <span
              class="flex-shrink-0 text-[1.2rem] transition-transform duration-200"
              style={`color:var(--green-600); transform:rotate(${openIdx === i ? '45' : '0'}deg);`}
            >
              +
            </span>
          </button>

          {openIdx === i && (
            <div
              class="px-5 pb-4 pt-1 text-[0.88rem] leading-relaxed"
              style="color:var(--ink-light); background:white;
                     border-top:1px solid rgba(29,107,66,.08);"
              dangerouslySetInnerHTML={{ __html: item.answer }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
