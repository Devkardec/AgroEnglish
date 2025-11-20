const vocabularyData = [
  {
    id: 1,
    category: "Machinery",
    term_en: "PTO Shaft",
    phonetic: "/ˌpiː.tiːˈoʊ ʃæft/",
    definition_en: "A splined driveshaft that transfers mechanical power from a tractor to an implement.",
    example_en: "Ensure the PTO shaft guard is securely in place before operating the mower.",
    term_pt: "Eixo de Tomada de Força (TDF)",
    definition_pt: "Um eixo de transmissão estriado que transfere a potência mecânica de um trator para um implemento.",
    example_pt: "Garanta que a proteção do eixo TDF esteja bem fixada antes de operar o cortador.",
    image: "https://placehold.co/400x250/0b2f6a/ffffff?text=PTO+Shaft"
  },
  {
    id: 2,
    category: "Crops",
    term_en: "Grafting",
    phonetic: "/ˈɡræftɪŋ/",
    definition_en: "A horticultural technique of joining tissues from two plants so they continue their growth together.",
    example_en: "Grafting is essential for creating citrus trees that are resistant to soil-borne diseases.",
    term_pt: "Enxertia",
    definition_pt: "Técnica de horticultura que une tecidos de duas plantas para que continuem seu crescimento juntas.",
    example_pt: "A enxertia é essencial para criar árvores de citros resistentes a doenças do solo.",
    image: "https://placehold.co/400x250/0b2f6a/ffffff?text=Grafting"
  },
  {
    id: 3,
    category: "Veterinary",
    term_en: "Heifer",
    phonetic: "/ˈhɛfər/",
    definition_en: "A young female bovine (cow) that has not yet had her first calf.",
    example_en: "The farmer is raising a new generation of heifers to expand the dairy herd.",
    term_pt: "Novilha",
    definition_pt: "Uma fêmea bovina jovem que ainda não teve seu primeiro bezerro.",
    example_pt: "O fazendeiro está criando uma nova geração de novilhas para expandir o rebanho leiteiro.",
    image: "https://placehold.co/400x250/0b2f6a/ffffff?text=Heifer"
  },
  {
    id: 4,
    category: "Machinery",
    term_en: "No-till Planter",
    phonetic: "/ˈnoʊ tɪl ˈplæntər/",
    definition_en: "A seeding implement designed to plant crops directly into undisturbed soil.",
    example_en: "The no-till planter cuts a narrow furrow and places the seed in one pass.",
    term_pt: "Plantadeira de Plantio Direto",
    definition_pt: "Um implemento de semeadura projetado para plantar culturas diretamente no solo não perturbado.",
    example_pt: "A plantadeira de plantio direto corta um sulco estreito e deposita a semente em uma única passada.",
    image: "https://placehold.co/400x250/0b2f6a/ffffff?text=No-till+Planter"
  },
  {
    id: 5,
    category: "Crops",
    term_en: "Crop Rotation",
    phonetic: "/krɒp roʊˈteɪʃən/",
    definition_en: "The practice of growing different crops in the same area across a sequence of seasons.",
    example_en: "Crop rotation with legumes can naturally replenish nitrogen in the soil.",
    term_pt: "Rotação de Culturas",
    definition_pt: "A prática de cultivar diferentes tipos de culturas na mesma área em uma sequência de estações.",
    example_pt: "A rotação de culturas com leguminosas pode reabastecer naturalmente o nitrogênio no solo.",
    image: "https://placehold.co/400x250/0b2f6a/ffffff?text=Crop+Rotation"
  },
  {
    id: 6,
    category: "Veterinary",
    term_en: "Mastitis",
    phonetic: "/mæˈstaɪtɪs/",
    definition_en: "Inflammation of the mammary gland in the udder, typically due to bacterial infection.",
    example_en: "Proper milking hygiene is crucial to prevent mastitis in dairy cows.",
    term_pt: "Mastite",
    definition_pt: "Inflamação da glândula mamária no úbere, geralmente devido a uma infecção bacteriana.",
    example_pt: "A higiene adequada na ordenha é crucial para prevenir a mastite em vacas leiteiras.",
    image: "https://placehold.co/400x250/0b2f6a/ffffff?text=Mastitis"
  },
  {
    id: 7,
    category: "Machinery",
    term_en: "Subsoiler",
    phonetic: "/ˈsʌbˌsɔɪlər/",
    definition_en: "A tillage tool used to break up compacted soil layers (hardpan) deep below the surface.",
    example_en: "He used a subsoiler to improve water drainage and root penetration.",
    term_pt: "Subsolador",
    definition_pt: "Uma ferramenta de preparo do solo usada para quebrar camadas de solo compactado (pé-de-grade) bem abaixo da superfície.",
    example_pt: "Ele usou um subsolador para melhorar a drenagem da água e a penetração das raízes.",
    image: "https://placehold.co/400x250/0b2f6a/ffffff?text=Subsoiler"
  },
  {
    id: 8,
    category: "Crops",
    term_en: "Loam",
    phonetic: "/loʊm/",
    definition_en: "A fertile soil of clay and sand containing humus, considered ideal for agriculture.",
    example_en: "The region is known for its rich loam, perfect for growing vegetables.",
    term_pt: "Solo franco",
    definition_pt: "Um solo fértil de argila e areia contendo húmus, considerado ideal para a agricultura.",
    example_pt: "A região é conhecida por seu solo franco rico, perfeito para o cultivo de hortaliças.",
    image: "https://placehold.co/400x250/0b2f6a/ffffff?text=Loam"
  },
  {
    id: 9,
    category: "Veterinary",
    term_en: "Gestation Period",
    phonetic: "/dʒɛˈsteɪʃən ˈpɪəriəd/",
    definition_en: "The length of pregnancy in an animal, from conception to birth.",
    example_en: "The gestation period for a sow is about 3 months, 3 weeks, and 3 days.",
    term_pt: "Período de Gestação",
    definition_pt: "A duração da gravidez em um animal, da concepção ao nascimento.",
    example_pt: "O período de gestação de uma porca é de aproximadamente 3 meses, 3 semanas e 3 dias.",
    image: "https://placehold.co/400x250/0b2f6a/ffffff?text=Gestation+Period"
  }
  ,{
    id: 10,
    category: "Irrigation",
    term_en: "Drip Irrigation",
    phonetic: "/drɪp ˌɪrɪˈɡeɪʃən/",
    definition_en: "A micro-irrigation system that saves water by delivering it directly to the plant root zone.",
    example_en: "Drip irrigation reduces evaporation and improves water-use efficiency.",
    term_pt: "Irrigação por gotejamento",
    definition_pt: "Sistema de microirrigação que economiza água ao entregar diretamente na zona radicular.",
    example_pt: "A irrigação por gotejamento reduz a evaporação e melhora a eficiência do uso da água.",
    image: "https://placehold.co/400x250/0b2f6a/ffffff?text=Drip+Irrigation"
  }
  ,{
    id: 21,
    category: "Irrigation",
    term_en: "Sprinkler Irrigation",
    phonetic: "/ˈsprɪŋklər ˌɪrɪˈɡeɪʃən/",
    definition_en: "A system that sprays water through pressurized pipes and nozzles to irrigate fields.",
    example_en: "Sprinkler irrigation is effective for uniform coverage on pastures.",
    term_pt: "Irrigação por aspersão",
    definition_pt: "Sistema que pulveriza água por tubulações pressurizadas e bicos para irrigar áreas.",
    example_pt: "A irrigação por aspersão é eficaz para cobertura uniforme em pastagens.",
    image: ""
  }
  ,{
    id: 22,
    category: "Irrigation",
    term_en: "Center Pivot",
    phonetic: "/ˈsɛntər ˈpɪvət/",
    definition_en: "Mechanized sprinkler system that rotates around a central pivot to irrigate circular fields.",
    example_en: "The center pivot requires regular inspection of towers and gearboxes.",
    term_pt: "Pivô central",
    definition_pt: "Sistema mecanizado de aspersão que gira em torno de um pivô para irrigar campos circulares.",
    example_pt: "O pivô central requer inspeção regular das torres e caixas de engrenagens.",
    image: ""
  }
  ,{
    id: 23,
    category: "Irrigation",
    term_en: "Fertigation",
    phonetic: "/ˈfɜːrtɪɡeɪʃən/",
    definition_en: "Applying fertilizers through an irrigation system for efficient nutrient delivery.",
    example_en: "Fertigation with nitrate requires precise dosing to avoid leaching.",
    term_pt: "Fertirrigação",
    definition_pt: "Aplicação de fertilizantes pelo sistema de irrigação para entregar nutrientes com eficiência.",
    example_pt: "A fertirrigação com nitrato requer dosagem precisa para evitar lixiviação.",
    image: ""
  }
  ,{
    id: 24,
    category: "Irrigation",
    term_en: "Emitter",
    phonetic: "/ɪˈmɪtər/",
    definition_en: "Device in drip lines that releases water at a controlled flow rate.",
    example_en: "Check emitter flow to ensure plants receive the correct volume.",
    term_pt: "Emissor",
    definition_pt: "Dispositivo nas linhas de gotejamento que libera água com vazão controlada.",
    example_pt: "Verifique a vazão do emissor para garantir o volume correto às plantas.",
    image: ""
  }
  ,{
    id: 25,
    category: "Irrigation",
    term_en: "Filter Screen",
    phonetic: "/ˈfɪltər skriːn/",
    definition_en: "Filtering element that removes particles from irrigation water to protect emitters.",
    example_en: "Clean the filter screen regularly to prevent clogging.",
    term_pt: "Tela filtrante",
    definition_pt: "Elemento de filtragem que remove partículas da água para proteger emissores.",
    example_pt: "Limpe a tela filtrante regularmente para prevenir obstruções.",
    image: ""
  }
  ,{
    id: 26,
    category: "Irrigation",
    term_en: "Pressure Regulator",
    phonetic: "/ˈprɛʃər ˈrɛɡjəleɪtər/",
    definition_en: "Device that stabilizes pressure to maintain consistent irrigation flow.",
    example_en: "Install a pressure regulator to protect drip lines from surges.",
    term_pt: "Regulador de pressão",
    definition_pt: "Dispositivo que estabiliza a pressão para manter vazão consistente na irrigação.",
    example_pt: "Instale um regulador de pressão para proteger as linhas de gotejamento contra picos.",
    image: ""
  }
  ,{
    id: 27,
    category: "Irrigation",
    term_en: "Flow Meter",
    phonetic: "/floʊ ˈmiːtər/",
    definition_en: "Instrument that measures the volume of water delivered by the system.",
    example_en: "Use a flow meter to monitor irrigation application rates.",
    term_pt: "Medidor de vazão",
    definition_pt: "Instrumento que mede o volume de água fornecido pelo sistema.",
    example_pt: "Use um medidor de vazão para monitorar as taxas de aplicação da irrigação.",
    image: ""
  }
  ,{
    id: 28,
    category: "Irrigation",
    term_en: "Valve Manifold",
    phonetic: "/ˈvælv ˈmænɪˌfoʊld/",
    definition_en: "Assembly of valves that controls flow to different irrigation zones.",
    example_en: "Label each valve manifold to simplify maintenance.",
    term_pt: "Manifold de válvulas",
    definition_pt: "Conjunto de válvulas que controla o fluxo para diferentes zonas de irrigação.",
    example_pt: "Identifique cada manifold de válvulas para facilitar a manutenção.",
    image: ""
  }
  ,{
    id: 29,
    category: "Irrigation",
    term_en: "Irrigation Scheduling",
    phonetic: "/ˌɪrɪˈɡeɪʃən ˈskɛdʒʊlɪŋ/",
    definition_en: "Planning irrigation timing and volume based on crop needs and soil moisture.",
    example_en: "Irrigation scheduling with sensors optimizes water usage.",
    term_pt: "Programação de irrigação",
    definition_pt: "Planejamento de tempo e volume de irrigação com base na cultura e umidade do solo.",
    example_pt: "A programação de irrigação com sensores otimiza o uso de água.",
    image: ""
  }
  ,{
    id: 11,
    category: "Machinery",
    term_en: "Hydraulic Coupler",
    phonetic: "/haɪˈdrɒlɪk ˈkʌplər/",
    definition_en: "A quick-connect device that links hydraulic hoses between tractor and implement.",
    example_en: "Clean the hydraulic coupler before connecting to avoid contamination.",
    term_pt: "Acoplador hidráulico",
    definition_pt: "Dispositivo de engate rápido que liga mangueiras hidráulicas entre trator e implemento.",
    example_pt: "Limpe o acoplador hidráulico antes de conectar para evitar contaminação.",
    image: "https://placehold.co/400x250/0b2f6a/ffffff?text=Hydraulic+Coupler"
  }
  ,{
    id: 12,
    category: "Soil",
    term_en: "pH",
    phonetic: "/piː eɪtʃ/",
    definition_en: "A measure of acidity or alkalinity of soil, affecting nutrient availability to plants.",
    example_en: "Adjust soil pH with lime to improve nutrient uptake in crops.",
    term_pt: "pH",
    definition_pt: "Medida de acidez ou alcalinidade do solo, que afeta a disponibilidade de nutrientes.",
    example_pt: "Ajuste o pH do solo com calcário para melhorar a absorção de nutrientes nas culturas.",
    image: "https://placehold.co/400x250/0b2f6a/ffffff?text=Soil+pH"
  }
  ,{
    id: 13,
    category: "Safety",
    term_en: "PPE",
    phonetic: "/ˌpiː.piːˈiː/",
    definition_en: "Personal protective equipment used to minimize exposure to hazards.",
    example_en: "Always wear PPE when handling agrochemicals.",
    term_pt: "EPI",
    definition_pt: "Equipamento de proteção individual utilizado para minimizar a exposição a riscos.",
    example_pt: "Sempre use EPI ao manusear agroquímicos.",
    image: "https://placehold.co/400x250/0b2f6a/ffffff?text=PPE"
  }
  ,{
    id: 14,
    category: "Crops",
    term_en: "Mulching",
    phonetic: "/ˈmʌltʃɪŋ/",
    definition_en: "Covering the soil with organic or synthetic material to conserve moisture and suppress weeds.",
    example_en: "Mulching helps maintain soil temperature and reduces erosion.",
    term_pt: "Cobertura morta",
    definition_pt: "Cobrir o solo com material orgânico ou sintético para conservar umidade e suprimir ervas daninhas.",
    example_pt: "A cobertura morta ajuda a manter a temperatura do solo e reduz a erosão.",
    image: "https://placehold.co/400x250/0b2f6a/ffffff?text=Mulching"
  }
  ,{
    id: 15,
    category: "Machinery",
    term_en: "Boom Sprayer",
    phonetic: "/buːm ˈspreɪər/",
    definition_en: "A sprayer with a long boom used to apply pesticides or fertilizers evenly across fields.",
    example_en: "Calibrate the boom sprayer to ensure accurate application rates.",
    term_pt: "Pulverizador de barra",
    definition_pt: "Pulverizador com barra longa usado para aplicar pesticidas ou fertilizantes uniformemente.",
    example_pt: "Calibre o pulverizador de barra para garantir taxas de aplicação precisas.",
    image: "https://placehold.co/400x250/0b2f6a/ffffff?text=Boom+Sprayer"
  }
  ,{
    id: 16,
    category: "Veterinary",
    term_en: "Biosecurity",
    phonetic: "/ˌbaɪoʊsɪˈkjʊrɪti/",
    definition_en: "Procedures intended to protect livestock from infection and disease.",
    example_en: "Strict biosecurity reduces the risk of contagious outbreaks.",
    term_pt: "Biossegurança",
    definition_pt: "Procedimentos destinados a proteger o rebanho contra infecções e doenças.",
    example_pt: "Biossegurança rígida reduz o risco de surtos contagiosos.",
    image: "https://placehold.co/400x250/0b2f6a/ffffff?text=Biosecurity"
  }
  ,{
    id: 17,
    category: "Soil",
    term_en: "Organic Matter",
    phonetic: "/ɔːˈɡænɪk ˈmætər/",
    definition_en: "Decomposed plant and animal residues that improve soil structure and fertility.",
    example_en: "High organic matter enhances water retention and microbial activity.",
    term_pt: "Matéria orgânica",
    definition_pt: "Resíduos de plantas e animais decompostos que melhoram a estrutura e a fertilidade do solo.",
    example_pt: "Alta matéria orgânica aumenta a retenção de água e a atividade microbiana.",
    image: "https://placehold.co/400x250/0b2f6a/ffffff?text=Organic+Matter"
  }
  ,{
    id: 18,
    category: "Safety",
    term_en: "Lockout/Tagout",
    phonetic: "/ˈlɒkaʊt ˈtæɡaʊt/",
    definition_en: "Safety procedure to ensure equipment remains off and cannot be started during maintenance.",
    example_en: "Implement lockout/tagout before servicing machinery.",
    term_pt: "Bloqueio/Etiquetagem",
    definition_pt: "Procedimento de segurança para garantir que o equipamento permaneça desligado durante manutenção.",
    example_pt: "Implemente bloqueio/etiquetagem antes de realizar manutenção em máquinas.",
    image: "https://placehold.co/400x250/0b2f6a/ffffff?text=Lockout+Tagout"
  }
  ,{
    id: 19,
    category: "Crops",
    term_en: "Cover Crop",
    phonetic: "/ˈkʌvər krɒp/",
    definition_en: "Crops planted to protect and enrich the soil between main growing seasons.",
    example_en: "Plant cover crops to reduce erosion and fix nitrogen.",
    term_pt: "Planta de cobertura",
    definition_pt: "Culturas plantadas para proteger e enriquecer o solo entre safras.",
    example_pt: "Plante culturas de cobertura para reduzir a erosão e fixar nitrogênio.",
    image: "https://placehold.co/400x250/0b2f6a/ffffff?text=Cover+Crop"
  }
  ,{
    id: 20,
    category: "Machinery",
    term_en: "PTO Guard",
    phonetic: "/ˌpiː.tiːˈoʊ ɡɑːrd/",
    definition_en: "A protective cover that shields the rotating PTO shaft to prevent entanglement injuries.",
    example_en: "Never remove the PTO guard while equipment is running.",
    term_pt: "Proteção do TDF",
    definition_pt: "Capa protetora que protege o eixo TDF giratório para evitar acidentes por enroscamento.",
    example_pt: "Nunca remova a proteção do TDF com o equipamento em funcionamento.",
    image: "https://placehold.co/400x250/0b2f6a/ffffff?text=PTO+Guard"
  }
];

export default vocabularyData;
