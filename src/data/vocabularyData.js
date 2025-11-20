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
    id: 30,
    category: "Irrigation",
    term_en: "Soil Moisture Sensor",
    phonetic: "/sɔɪl ˈmɔɪstʃər ˈsɛnsər/",
    definition_en: "Device that measures soil water content to guide irrigation decisions.",
    example_en: "Place soil moisture sensors at root depth for accurate readings.",
    term_pt: "Sensor de umidade do solo",
    definition_pt: "Dispositivo que mede o teor de água no solo para guiar a irrigação.",
    example_pt: "Instale sensores na profundidade das raízes para leituras precisas.",
    image: ""
  }
  ,{
    id: 31,
    category: "Irrigation",
    term_en: "Irrigation Controller",
    phonetic: "/ˌɪrɪˈɡeɪʃən kənˈtroʊlər/",
    definition_en: "Electronic unit that automates irrigation schedules and zone control.",
    example_en: "Program the irrigation controller according to crop growth stages.",
    term_pt: "Controlador de irrigação",
    definition_pt: "Unidade eletrônica que automatiza horários e controle de zonas.",
    example_pt: "Programe o controlador conforme as fases de crescimento da cultura.",
    image: ""
  }
  ,{
    id: 32,
    category: "Machinery",
    term_en: "Combine Harvester",
    phonetic: "/ˈkɒmbaɪn ˈhɑːrvɪstər/",
    definition_en: "Machine that reaps, threshes, and cleans grain in one operation.",
    example_en: "Check the combine harvester settings to reduce grain loss.",
    term_pt: "Colheitadeira",
    definition_pt: "Máquina que ceifa, debulha e limpa grãos em uma única operação.",
    example_pt: "Verifique os ajustes da colheitadeira para reduzir perdas de grãos.",
    image: ""
  }
  ,{
    id: 33,
    category: "Machinery",
    term_en: "Disc Harrow",
    phonetic: "/dɪsk ˈhæroʊ/",
    definition_en: "Implement that cuts and turns soil with rotating discs for seedbed preparation.",
    example_en: "Use a disc harrow to incorporate residue before planting.",
    term_pt: "Grade de discos",
    definition_pt: "Implemento que corta e revolve o solo com discos rotativos para preparo do leito.",
    example_pt: "Use a grade de discos para incorporar resíduos antes do plantio.",
    image: ""
  }
  ,{
    id: 34,
    category: "Machinery",
    term_en: "Seed Drill",
    phonetic: "/siːd drɪl/",
    definition_en: "Machine that places seeds at a controlled depth and spacing.",
    example_en: "Calibrate the seed drill to ensure uniform emergence.",
    term_pt: "Semeadora",
    definition_pt: "Máquina que deposita sementes com profundidade e espaçamento controlados.",
    example_pt: "Calibre a semeadora para garantir emergência uniforme.",
    image: ""
  }
  ,{
    id: 35,
    category: "Machinery",
    term_en: "Front Loader",
    phonetic: "/frʌnt ˈloʊdər/",
    definition_en: "Tractor attachment used for lifting and moving materials.",
    example_en: "Use the front loader to transport feed safely.",
    term_pt: "Carregador frontal",
    definition_pt: "Implemento de trator para levantar e mover materiais.",
    example_pt: "Use o carregador frontal para transportar ração com segurança.",
    image: ""
  }
  ,{
    id: 36,
    category: "Machinery",
    term_en: "Grain Auger",
    phonetic: "/ɡreɪn ˈɔːɡər/",
    definition_en: "Screw conveyor used to move grain into bins or trucks.",
    example_en: "Keep guards in place when operating the grain auger.",
    term_pt: "Rosca transportadora",
    definition_pt: "Transportador helicoidal usado para mover grãos para silos ou caminhões.",
    example_pt: "Mantenha as proteções instaladas ao operar a rosca transportadora.",
    image: ""
  }
  ,{
    id: 37,
    category: "Machinery",
    term_en: "Skid Steer",
    phonetic: "/skɪd stɪr/",
    definition_en: "Compact loader useful for material handling and farmyard tasks.",
    example_en: "The skid steer is ideal for cleaning pens quickly.",
    term_pt: "Mini carregadeira",
    definition_pt: "Carregadeira compacta útil para movimentação de materiais e tarefas na fazenda.",
    example_pt: "A mini carregadeira é ideal para limpar currais rapidamente.",
    image: ""
  }
  ,{
    id: 38,
    category: "Crops",
    term_en: "Germination",
    phonetic: "/ˌdʒɜːrmɪˈneɪʃən/",
    definition_en: "Process by which a seed begins to grow and develop into a plant.",
    example_en: "Warm soil temperatures improve germination rates.",
    term_pt: "Germinação",
    definition_pt: "Processo pelo qual a semente começa a crescer e se desenvolver em planta.",
    example_pt: "Temperaturas de solo mais altas melhoram a taxa de germinação.",
    image: ""
  }
  ,{
    id: 39,
    category: "Crops",
    term_en: "Pollination",
    phonetic: "/ˌpɒlɪˈneɪʃən/",
    definition_en: "Transfer of pollen that enables fertilization and seed formation.",
    example_en: "Bees play a vital role in pollination for many crops.",
    term_pt: "Polinização",
    definition_pt: "Transferência de pólen que possibilita a fertilização e formação de sementes.",
    example_pt: "Abelhas têm papel essencial na polinização de muitas culturas.",
    image: ""
  }
  ,{
    id: 40,
    category: "Crops",
    term_en: "Transplanting",
    phonetic: "/ˈtrænsplæntɪŋ/",
    definition_en: "Moving seedlings from nursery trays to field or larger containers.",
    example_en: "Transplanting tomatoes reduces time to harvest.",
    term_pt: "Transplantio",
    definition_pt: "Mover mudas das bandejas para o campo ou recipientes maiores.",
    example_pt: "Transplantar tomates reduz o tempo até a colheita.",
    image: ""
  }
  ,{
    id: 41,
    category: "Crops",
    term_en: "Pruning",
    phonetic: "/ˈpruːnɪŋ/",
    definition_en: "Cutting plant parts to improve structure, health, and yield.",
    example_en: "Regular pruning increases light penetration in orchards.",
    term_pt: "Poda",
    definition_pt: "Corte de partes da planta para melhorar estrutura, saúde e produtividade.",
    example_pt: "Podas regulares aumentam a penetração de luz em pomares.",
    image: ""
  }
  ,{
    id: 42,
    category: "Crops",
    term_en: "Intercropping",
    phonetic: "/ˌɪntərˈkrɒpɪŋ/",
    definition_en: "Growing two or more crops together to optimize resources and reduce pests.",
    example_en: "Intercropping maize with beans improves soil nitrogen.",
    term_pt: "Consorciação de culturas",
    definition_pt: "Cultivar duas ou mais culturas juntas para otimizar recursos e reduzir pragas.",
    example_pt: "Consorciar milho com feijão melhora o nitrogênio do solo.",
    image: ""
  }
  ,{
    id: 43,
    category: "Crops",
    term_en: "Weed Control",
    phonetic: "/wiːd kənˈtroʊl/",
    definition_en: "Management practices to suppress unwanted plants competing with crops.",
    example_en: "Mulching aids weed control in vegetable beds.",
    term_pt: "Controle de plantas daninhas",
    definition_pt: "Práticas para suprimir plantas indesejadas que competem com a cultura.",
    example_pt: "A cobertura morta auxilia o controle de daninhas em canteiros de hortaliças.",
    image: ""
  }
  ,{
    id: 44,
    category: "Crops",
    term_en: "Yield",
    phonetic: "/jiːld/",
    definition_en: "Amount of crop produced per area, often measured in kg/ha.",
    example_en: "Balanced fertilization increases yield potential.",
    term_pt: "Produtividade",
    definition_pt: "Quantidade de produção por área, geralmente medida em kg/ha.",
    example_pt: "Adubação equilibrada aumenta o potencial de produtividade.",
    image: ""
  }
  ,{
    id: 45,
    category: "Crops",
    term_en: "Fallow",
    phonetic: "/ˈfæloʊ/",
    definition_en: "Period when land is left unplanted to restore fertility.",
    example_en: "Rotate with fallow periods to reduce pest pressure.",
    term_pt: "Pousio",
    definition_pt: "Período em que a área fica sem cultivo para recuperar a fertilidade.",
    example_pt: "Alterne com pousio para reduzir pressão de pragas.",
    image: ""
  }
  ,{
    id: 46,
    category: "Veterinary",
    term_en: "Vaccination",
    phonetic: "/ˌvæksɪˈneɪʃən/",
    definition_en: "Administration of vaccines to stimulate immunity in animals.",
    example_en: "Follow vaccination schedules for calves and heifers.",
    term_pt: "Vacinação",
    definition_pt: "Administração de vacinas para estimular a imunidade em animais.",
    example_pt: "Siga os calendários de vacinação para bezerros e novilhas.",
    image: ""
  }
  ,{
    id: 47,
    category: "Veterinary",
    term_en: "Deworming",
    phonetic: "/ˌdiːˈwɜːrmɪŋ/",
    definition_en: "Treating animals to remove internal parasites.",
    example_en: "Schedule deworming before pasture turnout.",
    term_pt: "Vermifugação",
    definition_pt: "Tratamento dos animais para eliminar parasitas internos.",
    example_pt: "Programe a vermifugação antes de soltar no pasto.",
    image: ""
  }
  ,{
    id: 48,
    category: "Veterinary",
    term_en: "Colostrum",
    phonetic: "/kəˈlɒstrəm/",
    definition_en: "First milk rich in antibodies, vital for newborn immunity.",
    example_en: "Ensure calves receive colostrum within 6 hours of birth.",
    term_pt: "Colostro",
    definition_pt: "Primeiro leite rico em anticorpos, vital para a imunidade do recém-nascido.",
    example_pt: "Garanta colostro aos bezerros nas primeiras 6 horas.",
    image: ""
  }
  ,{
    id: 49,
    category: "Veterinary",
    term_en: "Estrus Cycle",
    phonetic: "/ˈiːstrəs ˈsaɪkəl/",
    definition_en: "Reproductive cycle in females including heat periods.",
    example_en: "Monitor estrus cycle to schedule breeding.",
    term_pt: "Ciclo estral",
    definition_pt: "Ciclo reprodutivo das fêmeas incluindo o cio.",
    example_pt: "Monitore o ciclo estral para programar a reprodução.",
    image: ""
  }
  ,{
    id: 50,
    category: "Veterinary",
    term_en: "Artificial Insemination",
    phonetic: "/ɑːˌtɪfɪʃəl ˌɪnˌsiːˈmeɪʃən/",
    definition_en: "Technique of placing semen into the uterus to achieve pregnancy.",
    example_en: "AI timing should match the onset of estrus.",
    term_pt: "Inseminação artificial",
    definition_pt: "Técnica de colocar sêmen no útero para obter gestação.",
    example_pt: "O timing da IA deve coincidir com o início do cio.",
    image: ""
  }
  ,{
    id: 51,
    category: "Veterinary",
    term_en: "Quarantine",
    phonetic: "/ˈkwɔːrəntiːn/",
    definition_en: "Isolation period to prevent disease spread when introducing new animals.",
    example_en: "Keep new animals in quarantine for 14 days.",
    term_pt: "Quarentena",
    definition_pt: "Período de isolamento para evitar disseminação de doenças ao introduzir animais.",
    example_pt: "Mantenha novos animais em quarentena por 14 dias.",
    image: ""
  }
  ,{
    id: 52,
    category: "Veterinary",
    term_en: "Antibiotic Withdrawal",
    phonetic: "/ˌæntɪbaɪˈɒtɪk ˈwɪðˌdrɔːl/",
    definition_en: "Required period after treatment before animal products can be sold.",
    example_en: "Respect withdrawal times to ensure milk safety.",
    term_pt: "Período de carência",
    definition_pt: "Tempo necessário após tratamento antes da venda de produtos de origem animal.",
    example_pt: "Respeite a carência para garantir segurança do leite.",
    image: ""
  }
  ,{
    id: 53,
    category: "Veterinary",
    term_en: "Hoof Trimming",
    phonetic: "/huːf ˈtrɪmɪŋ/",
    definition_en: "Routine maintenance to prevent lameness and improve mobility.",
    example_en: "Schedule hoof trimming for dairy cows twice per year.",
    term_pt: "Aparação de cascos",
    definition_pt: "Manutenção rotineira para prevenir claudicação e melhorar mobilidade.",
    example_pt: "Agende a aparação de cascos duas vezes por ano.",
    image: ""
  }
  ,{
    id: 54,
    category: "Soil",
    term_en: "Soil Texture",
    phonetic: "/ˈtɛkstʃər/",
    definition_en: "Proportion of sand, silt, and clay in the soil.",
    example_en: "Loam texture balances drainage and water holding.",
    term_pt: "Textura do solo",
    definition_pt: "Proporção de areia, silte e argila no solo.",
    example_pt: "Solo franco equilibra drenagem e retenção de água.",
    image: ""
  }
  ,{
    id: 55,
    category: "Soil",
    term_en: "Soil Structure",
    phonetic: "/ˈstrʌktʃər/",
    definition_en: "Arrangement of soil particles into aggregates affecting porosity.",
    example_en: "Good structure improves root development.",
    term_pt: "Estrutura do solo",
    definition_pt: "Arranjo de partículas em agregados que afeta a porosidade.",
    example_pt: "Boa estrutura melhora o desenvolvimento radicular.",
    image: ""
  }
  ,{
    id: 56,
    category: "Soil",
    term_en: "Compaction",
    phonetic: "/kəmˈpækʃən/",
    definition_en: "Increase in soil density that restricts root growth and infiltration.",
    example_en: "Avoid traffic on wet soils to prevent compaction.",
    term_pt: "Compactação",
    definition_pt: "Aumento da densidade do solo que restringe raízes e infiltração.",
    example_pt: "Evite tráfego em solos úmidos para prevenir compactação.",
    image: ""
  }
  ,{
    id: 57,
    category: "Soil",
    term_en: "Permeability",
    phonetic: "/ˌpɜːrmiəˈbɪləti/",
    definition_en: "Ease with which water moves through soil pores.",
    example_en: "Sandy soils have higher permeability than clay soils.",
    term_pt: "Permeabilidade",
    definition_pt: "Facilidade com que a água se move pelos poros do solo.",
    example_pt: "Solos arenosos têm maior permeabilidade que solos argilosos.",
    image: ""
  }
  ,{
    id: 58,
    category: "Soil",
    term_en: "Cation Exchange Capacity (CEC)",
    phonetic: "/ˈkætaɪən ɪksˈtʃeɪndʒ kəˈpæsɪti/",
    definition_en: "Ability of soil to hold and exchange nutrient cations.",
    example_en: "High CEC soils retain nutrients better.",
    term_pt: "Capacidade de troca catiônica (CTC)",
    definition_pt: "Capacidade do solo de reter e trocar cátions nutrientes.",
    example_pt: "Solos com alta CTC retêm melhor os nutrientes.",
    image: ""
  }
  ,{
    id: 59,
    category: "Soil",
    term_en: "Salinity",
    phonetic: "/səˈlɪnɪti/",
    definition_en: "Concentration of salts in soil affecting plant growth.",
    example_en: "Monitor salinity to prevent yield loss in irrigated areas.",
    term_pt: "Salinidade",
    definition_pt: "Concentração de sais no solo que afeta o crescimento das plantas.",
    example_pt: "Monitore a salinidade para evitar perdas em áreas irrigadas.",
    image: ""
  }
  ,{
    id: 60,
    category: "Soil",
    term_en: "Erosion",
    phonetic: "/ɪˈroʊʒən/",
    definition_en: "Loss of topsoil due to wind or water movement.",
    example_en: "Cover crops reduce soil erosion during rainy seasons.",
    term_pt: "Erosão",
    definition_pt: "Perda de camada superficial do solo por vento ou água.",
    example_pt: "Culturas de cobertura reduzem erosão em época de chuva.",
    image: ""
  }
  ,{
    id: 61,
    category: "Soil",
    term_en: "Infiltration",
    phonetic: "/ˌɪnfɪlˈtreɪʃən/",
    definition_en: "Rate at which water enters the soil surface.",
    example_en: "Residue cover increases infiltration rates.",
    term_pt: "Infiltração",
    definition_pt: "Taxa com que a água entra na superfície do solo.",
    example_pt: "Cobertura de resíduos aumenta a infiltração.",
    image: ""
  }
  ,{
    id: 62,
    category: "Soil",
    term_en: "Bulk Density",
    phonetic: "/bʌlk ˈdɛnsɪti/",
    definition_en: "Mass of soil per unit volume, indicating compaction.",
    example_en: "High bulk density limits root penetration.",
    term_pt: "Densidade aparente",
    definition_pt: "Massa de solo por volume, indicador de compactação.",
    example_pt: "Alta densidade aparente limita a penetração das raízes.",
    image: ""
  }
  ,{
    id: 63,
    category: "Soil",
    term_en: "Aggregate Stability",
    phonetic: "/ˈæɡrɪɡɪt ˈstæbɪlɪti/",
    definition_en: "Resistance of soil aggregates to disintegration when wet.",
    example_en: "Organic matter improves aggregate stability.",
    term_pt: "Estabilidade de agregados",
    definition_pt: "Resistência dos agregados do solo à desintegração quando molhados.",
    example_pt: "Matéria orgânica melhora a estabilidade dos agregados.",
    image: ""
  }
  ,{
    id: 64,
    category: "Safety",
    term_en: "Safety Data Sheet (SDS)",
    phonetic: "/ˈseɪfti ˈdeɪtə ʃiːt/",
    definition_en: "Document that provides hazard and handling information for chemicals.",
    example_en: "Keep SDS accessible in the chemical storage area.",
    term_pt: "Ficha de Segurança (FISPQ)",
    definition_pt: "Documento com informações de perigos e manuseio de químicos.",
    example_pt: "Mantenha a FISPQ acessível na área de armazenamento de químicos.",
    image: ""
  }
  ,{
    id: 65,
    category: "Safety",
    term_en: "Respirator",
    phonetic: "/ˈrɛspɪˌreɪtər/",
    definition_en: "Protective device worn over the face to filter airborne hazards.",
    example_en: "Wear a respirator when mixing pesticides.",
    term_pt: "Respirador",
    definition_pt: "Dispositivo de proteção usado no rosto para filtrar riscos no ar.",
    example_pt: "Use respirador ao preparar pesticidas.",
    image: ""
  }
  ,{
    id: 66,
    category: "Safety",
    term_en: "Hearing Protection",
    phonetic: "/ˈhɪərɪŋ prəˈtɛkʃən/",
    definition_en: "Equipment that reduces noise exposure to safe levels.",
    example_en: "Use hearing protection near running machinery.",
    term_pt: "Proteção auditiva",
    definition_pt: "Equipamento que reduz exposição a ruídos a níveis seguros.",
    example_pt: "Use proteção auditiva perto de máquinas em funcionamento.",
    image: ""
  }
  ,{
    id: 67,
    category: "Safety",
    term_en: "Machine Guarding",
    phonetic: "/məˈʃiːn ˈɡɑːrdɪŋ/",
    definition_en: "Use of shields and covers to protect from moving parts.",
    example_en: "Inspect machine guarding before operation.",
    term_pt: "Proteção de máquinas",
    definition_pt: "Uso de proteções e coberturas para evitar contato com partes móveis.",
    example_pt: "Inspecione as proteções de máquina antes de operar.",
    image: ""
  }
  ,{
    id: 68,
    category: "Safety",
    term_en: "Fire Extinguisher",
    phonetic: "/ˈfaɪər ɪkˈstɪŋɡwɪʃər/",
    definition_en: "Portable device used to put out small fires.",
    example_en: "Check fire extinguisher pressure monthly.",
    term_pt: "Extintor de incêndio",
    definition_pt: "Dispositivo portátil usado para apagar pequenos incêndios.",
    example_pt: "Verifique a pressão do extintor mensalmente.",
    image: ""
  }
  ,{
    id: 69,
    category: "Safety",
    term_en: "First Aid Kit",
    phonetic: "/ˈfɜːrst eɪd kɪt/",
    definition_en: "Supplies used to treat minor injuries on-site.",
    example_en: "Keep a stocked first aid kit in the workshop.",
    term_pt: "Kit de primeiros socorros",
    definition_pt: "Suprimentos usados para tratar lesões leves no local.",
    example_pt: "Mantenha um kit completo na oficina.",
    image: ""
  }
  ,{
    id: 70,
    category: "Safety",
    term_en: "Fall Protection",
    phonetic: "/fɔːl prəˈtɛkʃən/",
    definition_en: "Systems that prevent or arrest falls from heights.",
    example_en: "Use fall protection when working on silos.",
    term_pt: "Proteção contra quedas",
    definition_pt: "Sistemas que previnem ou interrompem quedas de alturas.",
    example_pt: "Use proteção contra quedas ao trabalhar em silos.",
    image: ""
  }
  ,{
    id: 71,
    category: "Safety",
    term_en: "Confined Space",
    phonetic: "/kənˈfaɪnd speɪs/",
    definition_en: "Area with limited entry and ventilation posing unique hazards.",
    example_en: "Never enter a confined space without testing air quality.",
    term_pt: "Espaço confinado",
    definition_pt: "Local com entrada e ventilação limitadas, com riscos específicos.",
    example_pt: "Nunca entre em espaço confinado sem testar a qualidade do ar.",
    image: ""
  }
  ,{
    id: 72,
    category: "Safety",
    term_en: "Eye Wash Station",
    phonetic: "/aɪ wɒʃ ˈsteɪʃən/",
    definition_en: "Facility for flushing eyes exposed to chemicals.",
    example_en: "Locate eye wash stations near chemical mixing areas.",
    term_pt: "Chuveiro lava-olhos",
    definition_pt: "Instalação para lavagem dos olhos expostos a químicos.",
    example_pt: "Instale lava-olhos próximo às áreas de preparo de químicos.",
    image: ""
  }
  ,{
    id: 73,
    category: "Safety",
    term_en: "Safe Lifting",
    phonetic: "/seɪf ˈlɪftɪŋ/",
    definition_en: "Technique of lifting loads while minimizing strain and injury.",
    example_en: "Practice safe lifting to avoid back injuries.",
    term_pt: "Levantamento seguro",
    definition_pt: "Técnica de levantar cargas minimizando esforço e lesões.",
    example_pt: "Pratique levantamento seguro para evitar lesões nas costas.",
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
