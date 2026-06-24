export interface CatalogItem {
  id: number;
  parentId: number | null;
  name: string;
  description: string | null;
  price: string | null;
  durationMinutes: number | null;
  category: string | null;
  procedureType: string | null;
}

export interface ParentService extends CatalogItem {
  parentId: null;
  children: CatalogItem[];
}

const mockCatalog: CatalogItem[] = [
  // ── Extensão de Cílios - Aplicação ──
  {
    id: 1,
    parentId: null,
    name: "Extensão de Cílios - Aplicação",
    description: "Aplicação de extensão de cílios com técnica profissional. Consulte as regras de manutenção: retorno em até 15 dias para manutenção obrigatória, sem garantia para procedimentos com mais de 20 dias.",
    price: null,
    durationMinutes: null,
    category: "Estética",
    procedureType: null,
  },
  {
    id: 10,
    parentId: 1,
    name: "Volume Russo",
    description: "Fios mais finos e maior densidade para um efeito marcante",
    price: "160.00",
    durationMinutes: 120,
    category: "Estética",
    procedureType: "Volume Russo",
  },
  {
    id: 11,
    parentId: 1,
    name: "Volume Híbrido",
    description: "Combinação de fios finos e grossos para um efeito natural",
    price: "140.00",
    durationMinutes: 110,
    category: "Estética",
    procedureType: "Volume Híbrido",
  },
  {
    id: 12,
    parentId: 1,
    name: "Volume Brasileiro",
    description: "Técnica brasileira com fios de diâmetro médio para volume moderado",
    price: "130.00",
    durationMinutes: 100,
    category: "Estética",
    procedureType: "Volume Brasileiro",
  },

  // ── Extensão de Cílios - Manutenção ──
  {
    id: 2,
    parentId: null,
    name: "Extensão de Cílios - Manutenção",
    description: "Manutenção periódica obrigatória dentro do prazo de 15 dias. Necessário agendar com antecedência mínima de 24h. Não são aceitos atrasos superiores a 10 minutos.",
    price: null,
    durationMinutes: null,
    category: "Estética",
    procedureType: null,
  },
  {
    id: 20,
    parentId: 2,
    name: "Manutenção - Volume Russo",
    description: "Reaplicação e ajustes no Volume Russo existente",
    price: "90.00",
    durationMinutes: 60,
    category: "Estética",
    procedureType: "Volume Russo",
  },
  {
    id: 21,
    parentId: 2,
    name: "Manutenção - Volume Híbrido",
    description: "Reaplicação e ajustes no Volume Híbrido existente",
    price: "80.00",
    durationMinutes: 60,
    category: "Estética",
    procedureType: "Volume Híbrido",
  },
  {
    id: 22,
    parentId: 2,
    name: "Manutenção - Volume Brasileiro",
    description: "Reaplicação e ajustes no Volume Brasileiro existente",
    price: "70.00",
    durationMinutes: 60,
    category: "Estética",
    procedureType: "Volume Brasileiro",
  },

  // ── Design de Sobrancelhas ──
  {
    id: 3,
    parentId: null,
    name: "Design de Sobrancelhas",
    description: "Design personalizado respeitando a anatomia do seu rosto. Higienização e relaxamento facial inclusos no procedimento.",
    price: null,
    durationMinutes: null,
    category: "Estética",
    procedureType: null,
  },
  {
    id: 30,
    parentId: 3,
    name: "Design Simples",
    description: "Modelagem com pinça",
    price: "45.00",
    durationMinutes: 30,
    category: "Estética",
    procedureType: "Design Simples",
  },
  {
    id: 31,
    parentId: 3,
    name: "Design com Henna",
    description: "Modelagem com pinça + correção com henna",
    price: "65.00",
    durationMinutes: 45,
    category: "Estética",
    procedureType: "Design com Henna",
  },
  {
    id: 32,
    parentId: 3,
    name: "Micropigmentação",
    description: "Técnica fio a fio com anestésico tópico",
    price: "220.00",
    durationMinutes: 90,
    category: "Estética",
    procedureType: "Micropigmentação",
  },

  // ── Corte Feminino ──
  {
    id: 4,
    parentId: null,
    name: "Corte Feminino",
    description: "Corte personalizado com lavagem e finalização inclusas. Consulte a profissional para recomendações de acordo com seu tipo de cabelo.",
    price: null,
    durationMinutes: null,
    category: "Cabelo",
    procedureType: null,
  },
  {
    id: 40,
    parentId: 4,
    name: "Corte Simples",
    description: "Corte seco ou úmido sem escova",
    price: "55.00",
    durationMinutes: 40,
    category: "Cabelo",
    procedureType: "Corte",
  },
  {
    id: 41,
    parentId: 4,
    name: "Corte com Escova",
    description: "Corte + lavagem + escova modelada",
    price: "80.00",
    durationMinutes: 60,
    category: "Cabelo",
    procedureType: "Corte",
  },
  {
    id: 42,
    parentId: 4,
    name: "Corte + Hidratação",
    description: "Corte + lavagem + hidratação profunda + finalização",
    price: "110.00",
    durationMinutes: 80,
    category: "Cabelo",
    procedureType: "Corte",
  },

  // ── Manicure ──
  {
    id: 5,
    parentId: null,
    name: "Manicure",
    description: "Serviço completo de cuidados com as unhas das mãos. Inclui lixamento, cutículas e finalização.",
    price: null,
    durationMinutes: null,
    category: "Unhas",
    procedureType: null,
  },
  {
    id: 50,
    parentId: 5,
    name: "Esmaltação Tradicional",
    description: "Unhas lixadas, cutículas removidas e esmalte tradicional",
    price: "35.00",
    durationMinutes: 30,
    category: "Unhas",
    procedureType: "Esmaltação",
  },
  {
    id: 51,
    parentId: 5,
    name: "Esmaltação em Gel",
    description: "Esmalte em gel com secagem UV e maior durabilidade",
    price: "60.00",
    durationMinutes: 45,
    category: "Unhas",
    procedureType: "Esmaltação",
  },
  {
    id: 52,
    parentId: 5,
    name: "Alongamento de Unhas",
    description: "Alongamento em gel com formato personalizado",
    price: "120.00",
    durationMinutes: 90,
    category: "Unhas",
    procedureType: "Alongamento Gel",
  },
];

export function useServiceCatalog() {
  const parents = computed<ParentService[]>(() => {
    const grouped: Record<number, CatalogItem[]> = {};

    for (const item of mockCatalog) {
      const pid = item.parentId;
      if (pid !== null) {
        if (!grouped[pid]) grouped[pid] = [];
        grouped[pid].push(item);
      }
    }

    return mockCatalog
      .filter((item): item is CatalogItem & { parentId: null } => item.parentId === null)
      .map((parent) => ({
        ...parent,
        children: grouped[parent.id] ?? [],
      }));
  });

  function formatPrice(value: string | null): string {
    if (!value) return "";
    const num = Number(value);
    if (Number.isNaN(num)) return value;
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  return { parents, formatPrice };
}
